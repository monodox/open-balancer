import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, MessageCircle, Search, ExternalLink, HelpCircle } from 'lucide-react'

export default function HelpPage() {
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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Comprehensive guides and API references
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
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>
              Get instant help from our support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <HelpCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>FAQ</CardTitle>
            <CardDescription>
              Frequently asked questions and answers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Browse FAQ
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get up and running in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">1</div>
                <span className="text-sm">Create your first application</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">2</div>
                <span className="text-sm">Configure authentication settings</span>
              </div>
              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">3</div>
                <span className="text-sm">Integrate with your application</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
            <CardDescription>Most viewed help articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium text-sm">How to set up authentication</h4>
                <p className="text-xs text-gray-600 mt-1">Step-by-step guide to get started</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium text-sm">Managing user permissions</h4>
                <p className="text-xs text-gray-600 mt-1">Configure roles and access control</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium text-sm">API integration examples</h4>
                <p className="text-xs text-gray-600 mt-1">Code samples for common use cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Need additional help? Reach out to our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-3">Available 24/7</p>
              <Button variant="outline" size="sm">Start Chat</Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">support@authapp.com</p>
              <Button variant="outline" size="sm">Send Email</Button>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <ExternalLink className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Community</h3>
              <p className="text-sm text-gray-600 mb-3">Join our forum</p>
              <Button variant="outline" size="sm">Visit Forum</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}