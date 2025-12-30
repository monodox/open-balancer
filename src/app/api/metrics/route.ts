import { NextRequest, NextResponse } from 'next/server'
import { brownoutManager } from '@/lib/brownout'
import { telemetryManager } from '@/lib/telemetry'

// Enhanced metrics generation with real telemetry integration
const generateEnhancedMetrics = async () => {
  // Get real metrics from telemetry manager
  const realMetrics = await telemetryManager.getMetrics()
  
  // Base metrics with some realistic variation
  const baseLatency = 800 + Math.random() * 1200 // 0.8-2 seconds base
  const baseErrorRate = 0.005 + Math.random() * 0.02 // 0.5-2.5% base error rate
  const baseCost = 15 + Math.random() * 25 // $15-40/hour base cost

  // Add occasional spikes to simulate real conditions
  const latencySpike = Math.random() < 0.15 ? Math.random() * 4000 : 0
  const errorSpike = Math.random() < 0.08 ? Math.random() * 0.12 : 0
  const costSpike = Math.random() < 0.12 ? Math.random() * 80 : 0

  // Use real metrics if available, otherwise use enhanced mock data
  const metrics = {
    latency_p95: realMetrics['http.request.duration']?.latest || Math.round(baseLatency + latencySpike),
    error_rate: realMetrics['http.request.errors']?.latest || Math.min(baseErrorRate + errorSpike, 1),
    token_cost_per_hour: realMetrics['llm.cost.per_request']?.latest * 3600 || Math.round((baseCost + costSpike) * 100) / 100,
    token_usage: realMetrics['llm.tokens.used']?.latest || Math.round(100 + Math.random() * 400),
    response_quality: realMetrics['response.quality_score']?.latest || Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
    timestamp: new Date()
  }

  // Record these metrics for telemetry
  telemetryManager.recordLatency(metrics.latency_p95, 'api/metrics')
  if (metrics.error_rate > 0.01) {
    telemetryManager.recordError('simulated_error', 'api/metrics')
  }

  return metrics
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
      const metrics = await generateEnhancedMetrics()
      metrics.timestamp = timestamp

      dataPoints.push({
        timestamp: timestamp.toISOString(),
        latency_p95: metrics.latency_p95,
        error_rate: metrics.error_rate,
        token_cost_per_hour: metrics.token_cost_per_hour,
        token_usage: metrics.token_usage,
        response_quality: metrics.response_quality,
        brownout_mode: brownoutManager.evaluateMode(metrics)
      })
    }

    // Get real telemetry summary
    const telemetrySummary = await telemetryManager.getMetrics()

    return NextResponse.json({
      metrics: dataPoints,
      current_mode: brownoutManager.getCurrentMode(),
      thresholds: brownoutManager.getThresholds(),
      telemetry_summary: telemetrySummary,
      metadata: {
        range: timeRange,
        interval,
        point_count: dataPoints.length,
        generated_at: new Date().toISOString(),
        real_metrics_available: Object.keys(telemetrySummary).length > 0
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