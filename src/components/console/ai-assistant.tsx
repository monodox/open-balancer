'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bot, Send, Minimize2, Maximize2, X, Sparkles, Clock, Zap, DollarSign } from 'lucide-react'
import { AIAgent } from '@/lib/ai-agent'

interface AIAssistantProps {
  context?: string
  agent?: AIAgent
  title?: string
  placeholder?: string
  className?: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    brownoutMode: string
    latency: number
    tokensUsed: number
    cost: number
  }
}

export function AIAssistant({ 
  context = 'general', 
  agent, 
  title = 'AI Assistant',
  placeholder = 'Ask me anything about open-Balancer...',
  className = ''
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiAgent = agent || new AIAgent()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await aiAgent.generateResponse(input.trim())
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        metadata: {
          brownoutMode: 'normal',
          latency: 800 + Math.random() * 400,
          tokensUsed: 50 + Math.random() * 100,
          cost: 0.001 + Math.random() * 0.002
        }
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Assistant error:', error)
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getBrownoutColor = (mode: string) => {
    switch (mode) {
      case 'normal': return 'bg-green-100 text-green-800'
      case 'soft': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-orange-100 text-orange-800'
      case 'emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitialMessage = () => {
    const contextMessages = {
      dashboard: "Hi! I'm your dashboard AI assistant. I can help you understand your system metrics, brownout status, and performance data. What would you like to know?",
      incidents: "Hello! I'm here to help you analyze incidents and understand how brownout strategies protect your system. What incident would you like to discuss?",
      brownout: "Hi there! I'm your brownout strategy assistant. I can help you understand and configure brownout modes, thresholds, and adaptive control. How can I assist you?",
      observability: "Welcome! I'm your observability assistant. I can help you understand your monitoring data, traces, logs, and system health. What would you like to explore?",
      help: "Hello! I'm here to provide guidance on open-Balancer setup, configuration, and best practices. What do you need help with?",
      chat: "Hi! I'm your LLM chat assistant. I can help you test different queries and understand how brownout modes affect responses. What would you like to try?",
      settings: "Hello! I can help you understand and configure your open-Balancer settings. What configuration would you like to discuss?"
    }

    return contextMessages[context as keyof typeof contextMessages] || 
           "Hi! I'm your open-Balancer AI assistant. I can help with brownout strategies, system monitoring, and configuration. How can I assist you today?"
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90"
        >
          <Bot className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className={`w-96 shadow-xl border-2 ${isMinimized ? 'h-auto' : 'h-[500px]'} flex flex-col`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center text-sm font-medium">
            <Bot className="mr-2 h-4 w-4" />
            {title}
            <Sparkles className="ml-2 h-3 w-3" />
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
              {messages.length === 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-sm">{getInitialMessage()}</p>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-500' : 'bg-primary'
                  }`}>
                    {message.type === 'user' ? (
                      <span className="text-xs font-medium text-white">U</span>
                    ) : (
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' ? 'bg-blue-50' : 'bg-gray-100'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {message.metadata && (
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                        <Badge className={getBrownoutColor(message.metadata.brownoutMode)}>
                          {message.metadata.brownoutMode}
                        </Badge>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {message.metadata.latency}ms
                        </span>
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {message.metadata.tokensUsed}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${message.metadata.cost.toFixed(4)}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder={placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() || isLoading}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {aiAgent && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Demo mode - responses are simulated
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}