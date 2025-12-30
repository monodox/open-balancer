import { NextRequest, NextResponse } from 'next/server'
import { brownoutManager, type SystemMetrics } from '@/lib/brownout'
import { metrics } from '@/lib/telemetry'

// Datadog webhook payload interface
interface DatadogWebhookPayload {
  alert_id: string
  alert_transition: 'Triggered' | 'Recovered' | 'No Data'
  alert_type: 'metric alert' | 'service check' | 'event alert'
  date: number
  event_msg: string
  event_title: string
  event_type: 'error' | 'warning' | 'info' | 'success'
  hostname?: string
  id: string
  last_updated: number
  org_id: string
  priority: 'normal' | 'low'
  snapshot?: string
  tags: string[]
  text_only_msg: string
  title: string
  user: string
}

export async function POST(request: NextRequest) {
  try {
    const payload: DatadogWebhookPayload = await request.json()
    
    console.log('Received Datadog webhook:', {
      alert_id: payload.alert_id,
      title: payload.title,
      transition: payload.alert_transition,
      tags: payload.tags
    })

    // Only process triggered alerts
    if (payload.alert_transition !== 'Triggered') {
      return NextResponse.json({ 
        status: 'ignored', 
        reason: 'Not a triggered alert' 
      })
    }

    // Extract brownout mode from tags
    const brownoutTag = payload.tags.find(tag => tag.startsWith('brownout:'))
    const requestedMode = brownoutTag?.split(':')[1] as 'soft' | 'hard' | 'emergency'

    if (!requestedMode) {
      return NextResponse.json({ 
        status: 'ignored', 
        reason: 'No brownout mode specified in tags' 
      })
    }

    // Create mock metrics based on alert type
    const mockMetrics: SystemMetrics = {
      latency_p95: 0,
      error_rate: 0,
      token_cost_per_hour: 0,
      timestamp: new Date()
    }

    // Set appropriate threshold breach based on requested mode
    switch (requestedMode) {
      case 'soft':
        mockMetrics.latency_p95 = 2500 // Above soft threshold
        break
      case 'hard':
        mockMetrics.latency_p95 = 6000 // Above hard threshold
        break
      case 'emergency':
        mockMetrics.latency_p95 = 12000 // Above emergency threshold
        break
    }

    // Update brownout mode
    const newMode = brownoutManager.updateMode(mockMetrics)
    
    // Record the mode change
    metrics.recordBrownoutMode(newMode)

    // Log the brownout activation
    console.log(`Brownout activated via Datadog webhook:`, {
      alert_id: payload.alert_id,
      requested_mode: requestedMode,
      actual_mode: newMode,
      alert_title: payload.title,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      status: 'success',
      brownout_mode: newMode,
      alert_id: payload.alert_id,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error processing Datadog webhook:', error)
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to process webhook',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    current_mode: brownoutManager.getCurrentMode(),
    thresholds: brownoutManager.getThresholds(),
    timestamp: new Date().toISOString()
  })
}