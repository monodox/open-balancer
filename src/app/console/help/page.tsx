'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, MessageCircle, Search, ExternalLink, HelpCircle, Clock, Tag } from 'lucide-react'
import { mockHelpArticles } from '@/lib/mock-data'

export default function HelpPage() {
  const [articles] = useState(mockHelpArticles)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Getting Started': return 'bg-green-100 text-green-800'
      case 'Concepts': return 'bg-blue-100 text-blue-800'
      case 'Integrations': return 'bg-purple-100 text-purple-800'
      case 'Troubleshooting': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-2">
          Find answers, documentation, and get support
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search help articles..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Comprehensive guides for open-Balancer setup and configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Docs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Community Support</CardTitle>
            <CardDescription>
              Connect with other developers using open-Balancer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Join Community
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <HelpCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>GitHub Issues</CardTitle>
            <CardDescription>
              Report bugs and request features on GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Issue
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get open-Balancer running in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">1</div>
                <span className="text-sm">Install dependencies and configure environment</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">2</div>
                <span className="text-sm">Set up Datadog integration and API keys</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">3</div>
                <span className="text-sm">Configure brownout thresholds and strategies</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">4</div>
                <span className="text-sm">Test your LLM integration with brownout modes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Help Articles</CardTitle>
            <CardDescription>
              {searchTerm ? `${filteredArticles.length} articles found` : 'Browse our knowledge base'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{article.title}</h4>
                    <Badge className={getCategoryColor(article.category)} variant="outline">
                      {article.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{article.content.substring(0, 100)}...</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(article.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
          <CardDescription>Additional resources and support channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Documentation</h3>
              <p className="text-sm text-gray-600 mb-3">Complete API reference and guides</p>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3 w-3" />
                Read Docs
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">GitHub Discussions</h3>
              <p className="text-sm text-gray-600 mb-3">Community Q&A and discussions</p>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3 w-3" />
                Join Discussion
              </Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <ExternalLink className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">support@open-balancer.org</p>
              <Button variant="outline" size="sm">Send Email</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}