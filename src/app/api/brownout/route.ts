import { NextRequest, NextResponse } from 'next/server'
import { brownoutManager, type BrownoutMode } from '@/lib/brownout'
import { metrics } from '@/lib/telemetry'

export async function GET() {
  try {
    const currentMode = brownoutManager.getCurrentMode()
    const thresholds = brownoutManager.getThresholds()
    const llmConfig = brownoutManager.getLLMConfig()

    return NextResponse.json({
      current_mode: currentMode,
      thresholds,
      llm_config: llmConfig,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error getting brownout status:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get brownout status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode, reason } = body

    // Validate mode
    const validModes: BrownoutMode[] = ['normal', 'soft', 'hard', 'emergency']
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid brownout mode', valid_modes: validModes },
        { status: 400 }
      )
    }

    // Create mock metrics that would trigger the desired mode
    const mockMetrics = {
      latency_p95: 0,
      error_rate: 0,
      token_cost_per_hour: 0,
      timestamp: new Date()
    }

    // Set metrics to trigger the desired mode
    switch (mode) {
      case 'soft':
        mockMetrics.latency_p95 = 2500
        break
      case 'hard':
        mockMetrics.latency_p95 = 6000
        break
      case 'emergency':
        mockMetrics.latency_p95 = 12000
        break
      case 'normal':
        mockMetrics.latency_p95 = 1000
        break
    }

    // Update the mode
    const newMode = brownoutManager.updateMode(mockMetrics)
    
    // Record the manual mode change
    metrics.recordBrownoutMode(newMode)

    console.log(`Manual brownout mode change:`, {
      requested_mode: mode,
      actual_mode: newMode,
      reason: reason || 'Manual override',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      status: 'success',
      previous_mode: brownoutManager.getCurrentMode(),
      new_mode: newMode,
      llm_config: brownoutManager.getLLMConfig(),
      reason: reason || 'Manual override',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error setting brownout mode:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to set brownout mode',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { thresholds } = body

    if (!thresholds) {
      return NextResponse.json(
        { error: 'Missing thresholds in request body' },
        { status: 400 }
      )
    }

    // Update thresholds
    brownoutManager.updateThresholds(thresholds)

    console.log('Brownout thresholds updated:', {
      new_thresholds: thresholds,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      status: 'success',
      updated_thresholds: brownoutManager.getThresholds(),
      current_mode: brownoutManager.getCurrentMode(),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error updating brownout thresholds:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to update thresholds',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}