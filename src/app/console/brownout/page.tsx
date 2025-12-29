import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, Settings } from 'lucide-react'

export default function BrownoutPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Brownout Management</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage system performance during high load
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-green-600 mb-2">Normal</div>
              <p className="text-sm text-gray-600">All systems operating normally</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Last Brownout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-gray-400 mb-2">-</div>
              <p className="text-sm text-gray-600">No recent brownouts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-500" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <Button variant="outline" className="w-full">
                Configure Thresholds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brownout History</CardTitle>
            <CardDescription>Recent brownout events and their impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No brownout events</p>
              <p className="text-sm">Brownout history will appear here when events occur</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>System performance during brownout conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No metrics available</div>
              <p className="text-sm">Performance data will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Brownout Settings</CardTitle>
          <CardDescription>Configure automatic brownout responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Auto-scaling</h3>
                <p className="text-sm text-gray-600">Automatically scale resources during high load</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Rate Limiting</h3>
                <p className="text-sm text-gray-600">Implement rate limiting during brownout conditions</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-600">Alert team members when brownout occurs</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}