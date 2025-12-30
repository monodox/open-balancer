import { NextRequest, NextResponse } from 'next/server'
import { brownoutManager } from '@/lib/brownout'

// Mock metrics data - in production this would come from your monitoring system
const generateMockMetrics = () => {
  const baseLatency = 1000 + Math.random() * 2000 // 1-3 seconds base
  const baseErrorRate = 0.01 + Math.random() * 0.05 // 1-6% base error rate
  const baseCost = 20 + Math.random() * 40 // $20-60/hour base cost

  // Add some spikes occasionally
  const latencySpike = Math.random() < 0.1 ? Math.random() * 5000 : 0
  const errorSpike = Math.random() < 0.05 ? Math.random() * 0.15 : 0
  const costSpike = Math.random() < 0.1 ? Math.random() * 100 : 0

  return {
    latency_p95: Math.round(baseLatency + latencySpike),
    error_rate: Math.min(baseErrorRate + errorSpike, 1),
    token_cost_per_hour: Math.round((baseCost + costSpike) * 100) / 100,
    timestamp: new Date()
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeRange = searchParams.get('range') || '1h'
    const interval = searchParams.get('interval') || '1m'

    // Generate time series data
    const now = new Date()
    const dataPoints = []
    const intervalMs = interval === '1m' ? 60000 : interval === '5m' ? 300000 : 60000
    const rangeMs = timeRange === '1h' ? 3600000 : timeRange === '24h' ? 86400000 : 3600000
    const pointCount = Math.min(rangeMs / intervalMs, 100) // Limit to 100 points

    for (let i = pointCount; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * intervalMs))
      const metrics = generateMockMetrics()
      metrics.timestamp = timestamp

      dataPoints.push({
        timestamp: timestamp.toISOString(),
        latency_p95: metrics.latency_p95,
        error_rate: metrics.error_rate,
        token_cost_per_hour: metrics.token_cost_per_hour,
        brownout_mode: brownoutManager.evaluateMode(metrics)
      })
    }

    return NextResponse.json({
      metrics: dataPoints,
      current_mode: brownoutManager.getCurrentMode(),
      thresholds: brownoutManager.getThresholds(),
      metadata: {
        range: timeRange,
        interval,
        point_count: dataPoints.length,
        generated_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error generating metrics:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const metrics = await request.json()
    
    // Validate metrics
    if (!metrics.latency_p95 || !metrics.error_rate || !metrics.token_cost_per_hour) {
      return NextResponse.json(
        { error: 'Missing required metrics fields' },
        { status: 400 }
      )
    }

    // Update brownout mode based on metrics
    const newMode = brownoutManager.updateMode({
      latency_p95: metrics.latency_p95,
      error_rate: metrics.error_rate,
      token_cost_per_hour: metrics.token_cost_per_hour,
      timestamp: new Date()
    })

    return NextResponse.json({
      status: 'success',
      brownout_mode: newMode,
      llm_config: brownoutManager.getLLMConfig(),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error processing metrics:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}