import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, Settings, Activity } from 'lucide-react'
import { useBrownout } from '@/hooks/use-brownout'

export default function BrownoutPage() {
  const { status, loading, error, setMode } = useBrownout()

  const handleModeChange = async (mode: 'normal' | 'soft' | 'hard' | 'emergency') => {
    try {
      await setMode(mode, 'Manual override from console')
    } catch (err) {
      console.error('Failed to change brownout mode:', err)
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'normal': return 'text-green-600'
      case 'soft': return 'text-yellow-600'
      case 'hard': return 'text-orange-600'
      case 'emergency': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'normal': return 'All systems operating normally'
      case 'soft': return 'Slightly reduced complexity, faster responses'
      case 'hard': return 'Simplified responses, essential features only'
      case 'emergency': return 'Minimal responses, maximum reliability'
      default: return 'Unknown mode'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Brownout Management</h1>
          <p className="text-gray-600 mt-2">Loading brownout status...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Brownout Management</h1>
          <p className="text-red-600 mt-2">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Brownout Management</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage adaptive LLM response strategies during high load
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className={`mr-2 h-5 w-5 ${getModeColor(status?.current_mode || 'normal')}`} />
              Current Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className={`text-2xl font-bold mb-2 capitalize ${getModeColor(status?.current_mode || 'normal')}`}>
                {status?.current_mode || 'Unknown'}
              </div>
              <p className="text-sm text-gray-600">
                {getModeDescription(status?.current_mode || 'normal')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Latency Threshold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {status?.thresholds?.soft?.latency_p95 || 2000}ms
              </div>
              <p className="text-sm text-gray-600">P95 soft threshold</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Error Threshold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {((status?.thresholds?.soft?.error_rate || 0.05) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Error rate soft threshold</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-500" />
              Cost Threshold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-gray-600 mb-2">
                ${status?.thresholds?.soft?.token_cost_per_hour || 50}/hr
              </div>
              <p className="text-sm text-gray-600">Token cost soft threshold</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Manual Mode Control</CardTitle>
            <CardDescription>Override automatic brownout mode for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant={status?.current_mode === 'normal' ? 'default' : 'outline'}
                onClick={() => handleModeChange('normal')}
                className="w-full"
              >
                Normal
              </Button>
              <Button 
                variant={status?.current_mode === 'soft' ? 'default' : 'outline'}
                onClick={() => handleModeChange('soft')}
                className="w-full"
              >
                Soft
              </Button>
              <Button 
                variant={status?.current_mode === 'hard' ? 'default' : 'outline'}
                onClick={() => handleModeChange('hard')}
                className="w-full"
              >
                Hard
              </Button>
              <Button 
                variant={status?.current_mode === 'emergency' ? 'default' : 'outline'}
                onClick={() => handleModeChange('emergency')}
                className="w-full"
              >
                Emergency
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current LLM Configuration</CardTitle>
            <CardDescription>Active settings based on brownout mode</CardDescription>
          </CardHeader>
          <CardContent>
            {status?.llm_config ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Max Tokens:</span>
                  <span className="text-sm">{status.llm_config.max_tokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Temperature:</span>
                  <span className="text-sm">{status.llm_config.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Complexity:</span>
                  <span className="text-sm capitalize">{status.llm_config.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Features:</span>
                  <span className="text-sm">{status.llm_config.features.length} enabled</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No configuration available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brownout History</CardTitle>
          <CardDescription>Recent brownout events and mode changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No recent brownout events</p>
            <p className="text-sm">Brownout history will appear here when mode changes occur</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}