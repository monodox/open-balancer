import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Chat</h1>
        <p className="text-gray-600 mt-2">
          Get help from our support team
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Live Support
            </CardTitle>
            <CardDescription>
              Connect with our support team for assistance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="text-center text-gray-500 py-20">
                <MessageCircle className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No active chat session</p>
                <p className="text-sm">Start a conversation to get help from our support team</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Input 
                placeholder="Type your message..." 
                className="flex-1"
                disabled
              />
              <Button disabled>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Help</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Browse our documentation for common questions and solutions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Send us an email at support@authapp.com for detailed assistance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Join our community forum to connect with other developers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}