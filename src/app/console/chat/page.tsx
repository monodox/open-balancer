'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send, Bot, User, Clock, DollarSign, Zap } from 'lucide-react'
import { mockChatHistory } from '../../../lib/mock-data'
import { AIAssistant } from '../../../components/console/ai-assistant'
import { aiAgent } from '../../../lib/ai-agent'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState(mockChatHistory)

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    // Add user message
    const userMessage = {
      id: `chat-${Date.now()}`,
      message: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'question',
      // Additional properties for chat display
      user: 'test@example.com',
      response: 'This is a demo response. In production, this would connect to your LLM service.',
      model: 'gpt-4',
      tokensUsed: Math.floor(50 + Math.random() * 200),
      cost: Math.round((50 + Math.random() * 200) * 0.000015 * 10000) / 10000,
      latency: Math.floor(800 + Math.random() * 1200),
      brownoutMode: 'normal',
      quality: 0.85 + Math.random() * 0.15
    }
    
    setChatHistory([userMessage, ...chatHistory])
    setMessage('')
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
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">LLM Chat Interface</h1>
        <p className="text-gray-600 mt-2">
          Test your LLM integration with real-time brownout monitoring
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[700px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with LLM
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Normal Mode
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Interactive chat with brownout-aware responses
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 border rounded-lg p-4 mb-4 bg-gray-50 overflow-y-auto">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                      <Bot className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">Start a conversation</p>
                      <p className="text-sm">Ask anything to test the LLM integration</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatHistory.map((chat) => (
                        <div key={chat.id} className="space-y-3">
                          {/* User Message */}
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-sm">{chat.message}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(chat.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          
                          {/* Bot Response */}
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-white border rounded-lg p-3">
                                <p className="text-sm">{chat.response}</p>
                                <div className="flex items-center space-x-4 mt-2 pt-2 border-t">
                                  <Badge className={getBrownoutColor(chat.brownoutMode)}>
                                    {chat.brownoutMode}
                                  </Badge>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {chat.latency}ms
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Zap className="h-3 w-3 mr-1" />
                                    {chat.tokensUsed} tokens
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    ${chat.cost.toFixed(4)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Ask me anything..." 
                    className="flex-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Messages</span>
                  <span className="text-sm font-medium">{chatHistory.length * 2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Tokens</span>
                  <span className="text-sm font-medium">
                    {chatHistory.reduce((sum, chat) => sum + chat.tokensUsed, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Cost</span>
                  <span className="text-sm font-medium">
                    ${chatHistory.reduce((sum, chat) => sum + chat.cost, 0).toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Latency</span>
                  <span className="text-sm font-medium">
                    {chatHistory.length > 0 
                      ? Math.round(chatHistory.reduce((sum, chat) => sum + chat.latency, 0) / chatHistory.length)
                      : 0}ms
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Brownout Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['normal', 'soft', 'hard', 'emergency'].map(mode => {
                    const count = chatHistory.filter(chat => chat.brownoutMode === mode).length
                    const percentage = chatHistory.length > 0 ? (count / chatHistory.length) * 100 : 0
                    return (
                      <div key={mode} className="flex items-center justify-between">
                        <Badge className={getBrownoutColor(mode)} variant="outline">
                          {mode}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setMessage("Explain quantum computing")}
                >
                  Test Complex Query
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setMessage("What is 2+2?")}
                >
                  Test Simple Query
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setChatHistory([])}
                >
                  Clear History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIAssistant 
        context="chat"
        agent={aiAgent}
        title="LLM Chat Assistant"
        placeholder="Ask me to help test different queries or explain brownout behavior..."
      />
    </div>
  )
}