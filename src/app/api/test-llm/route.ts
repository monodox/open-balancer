import { NextRequest, NextResponse } from 'next/server'
import { telemetryManager } from '@/lib/telemetry'
import { brownoutManager } from '@/lib/brownout'

// Simulate LLM API call with realistic metrics
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { prompt, model = 'gpt-4', complexity = 'medium' } = await request.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Get current brownout configuration
    const llmConfig = brownoutManager.getLLMConfig()
    
    // Simulate processing time based on brownout mode
    const baseDelay = {
      normal: 1000 + Math.random() * 2000,    // 1-3s
      soft: 800 + Math.random() * 1200,       // 0.8-2s  
      hard: 500 + Math.random() * 800,        // 0.5-1.3s
      emergency: 200 + Math.random() * 300    // 0.2-0.5s
    }[brownoutManager.getCurrentMode()]
    
    // Add some realistic variation
    const processingDelay = baseDelay + (Math.random() < 0.1 ? Math.random() * 2000 : 0)
    
    // Simulate the API call delay
    await new Promise(resolve => setTimeout(resolve, processingDelay))
    
    // Calculate metrics
    const duration = Date.now() - startTime
    const tokenUsage = Math.round(llmConfig.max_tokens * (0.6 + Math.random() * 0.4))
    const cost = tokenUsage * 0.00015 // $0.00015 per token for GPT-4
    const quality = Math.max(0.3, llmConfig.complexity === 'high' ? 0.9 : 
                            llmConfig.complexity === 'medium' ? 0.75 :
                            llmConfig.complexity === 'low' ? 0.6 : 0.4)
    
    // Record telemetry
    telemetryManager.recordLatency(duration, '/api/test-llm')
    telemetryManager.recordTokenUsage(tokenUsage, model, 'completion')
    telemetryManager.recordCost(cost)
    telemetryManager.recordResponseQuality(quality + (Math.random() * 0.1 - 0.05), model)
    
    // Simulate occasional errors based on system stress
    const errorProbability = {
      normal: 0.01,
      soft: 0.03,
      hard: 0.08,
      emergency: 0.15
    }[brownoutManager.getCurrentMode()]
    
    if (Math.random() < errorProbability) {
      telemetryManager.recordError('llm_timeout', '/api/test-llm')
      return NextResponse.json(
        { error: 'LLM request timeout', brownout_mode: brownoutManager.getCurrentMode() },
        { status: 503 }
      )
    }
    
    // Generate response based on brownout mode
    const responses = {
      normal: `This is a comprehensive response to: "${prompt}". The system is operating normally with full capabilities enabled.`,
      soft: `Response to: "${prompt}". Operating in soft brownout mode with slightly reduced complexity.`,
      hard: `Brief response: "${prompt}". Hard brownout mode - simplified response.`,
      emergency: `Emergency mode: Basic response only.`
    }
    
    return NextResponse.json({
      response: responses[brownoutManager.getCurrentMode()],
      metadata: {
        model,
        brownout_mode: brownoutManager.getCurrentMode(),
        tokens_used: tokenUsage,
        cost_usd: Math.round(cost * 10000) / 10000,
        duration_ms: duration,
        quality_score: Math.round(quality * 100) / 100,
        llm_config: llmConfig
      }
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    telemetryManager.recordLatency(duration, '/api/test-llm')
    telemetryManager.recordError('internal_error', '/api/test-llm')
    
    console.error('Error in test LLM endpoint:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    current_brownout_mode: brownoutManager.getCurrentMode(),
    llm_config: brownoutManager.getLLMConfig(),
    timestamp: new Date().toISOString()
  })
}