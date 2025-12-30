import { NextRequest, NextResponse } from 'next/server'
import { brownoutManager } from '@/lib/brownout'
import { telemetryManager } from '@/lib/telemetry'

// Gemini API integration
async function callGeminiAPI(message: string, context: string, apiKey: string) {
  const currentMode = brownoutManager.getCurrentMode()
  const llmConfig = brownoutManager.getLLMConfig()
  
  // Adjust system prompt based on brownout mode
  const systemPrompts = {
    normal: `You are an AI assistant for open-Balancer, helping users with LLM adaptive control and brownout strategies. Provide comprehensive, detailed responses.`,
    soft: `You are an AI assistant for open-Balancer. Provide helpful but concise responses about LLM adaptive control and brownout strategies.`,
    hard: `You are an AI assistant for open-Balancer. Provide brief, focused responses about LLM adaptive control and brownout strategies.`,
    emergency: `You are an AI assistant for open-Balancer. Provide very brief, essential responses only.`
  }

  const contextPrompts = {
    dashboard: 'Focus on helping users understand their system metrics, brownout status, and performance data.',
    incidents: 'Focus on incident analysis and how brownout strategies help mitigate system issues.',
    brownout: 'Focus on brownout modes, thresholds, and adaptive control strategies.',
    observability: 'Focus on monitoring data, traces, logs, and system health metrics.',
    help: 'Focus on setup, configuration, troubleshooting, and best practices.',
    chat: 'Focus on helping users test LLM queries and understand brownout behavior.',
    settings: 'Focus on configuration, integrations, and account settings.'
  }

  const systemPrompt = systemPrompts[currentMode] + ' ' + (contextPrompts[context as keyof typeof contextPrompts] || '')

  try {
    // Real Gemini API call
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}`
          }]
        }],
        generationConfig: {
          temperature: llmConfig.temperature,
          maxOutputTokens: llmConfig.max_tokens,
          topP: 0.8,
          topK: 10
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API')
    }

    const content = data.candidates[0].content.parts[0].text
    const tokensUsed = Math.floor(content.length / 4) // Rough estimate
    const cost = tokensUsed * 0.000125 // Gemini Pro pricing estimate

    return {
      content,
      tokensUsed,
      cost
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { message, context = 'general', apiKey } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    const currentMode = brownoutManager.getCurrentMode()
    
    // Call Gemini API
    const result = await callGeminiAPI(message, context, apiKey)
    
    const latency = Date.now() - startTime
    const quality = Math.min(0.7 + (result.content.length / 1000) * 0.2, 1)

    // Record telemetry
    telemetryManager.recordTokenUsage(result.tokensUsed, 'gemini-pro', context)
    telemetryManager.recordCost(result.cost)
    telemetryManager.recordLatency(latency, 'ai-chat')
    telemetryManager.recordResponseQuality(quality, 'gemini-pro')

    const response = {
      content: result.content,
      tokensUsed: result.tokensUsed,
      cost: result.cost,
      latency,
      quality,
      brownoutMode: currentMode,
      model: 'gemini-pro',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    const latency = Date.now() - startTime
    telemetryManager.recordLatency(latency, 'ai-chat')
    telemetryManager.recordError('ai_chat_error', 'ai-chat')

    console.error('AI Chat API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process AI chat request',
        message: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    model: 'gemini-pro',
    brownout_mode: brownoutManager.getCurrentMode(),
    timestamp: new Date().toISOString()
  })
}