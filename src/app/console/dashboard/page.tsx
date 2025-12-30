'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, Shield, Activity } from 'lucide-react'
import { useBrownout, useMetrics } from '@/hooks/use-brownout'
import { AIAssistant } from '../../../components/console/ai-assistant'
import { dashboardAgent } from '../../../lib/ai-agent'

export default function DashboardPage() {
  const { status } = useBrownout()
  const { data: metricsData } = useMetrics('1h', '5m')

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'normal': return 'text-green-600'
      case 'soft': return 'text-yellow-600'
      case 'hard': return 'text-orange-600'
      case 'emergency': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getLatestMetrics = () => {
    if (!metricsData?.metrics?.length) return null
    return metricsData.metrics[metricsData.metrics.length - 1]
  }

  const latestMetrics = getLatestMetrics()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor your LLM application's adaptive control and brownout strategies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brownout Mode</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${getModeColor(status?.current_mode || 'normal')}`}>
              {status?.current_mode || 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">Current adaptive mode</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics ? `${latestMetrics.latency_p95}ms` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">P95 latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics ? `${(latestMetrics.error_rate * 100).toFixed(1)}%` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Current error rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Cost</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics ? `$${latestMetrics.token_cost_per_hour.toFixed(2)}/hr` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Hourly token cost</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest brownout events and model adaptations</CardDescription>
          </CardHeader>
          <CardContent>
            {metricsData?.metrics ? (
              <div className="space-y-3">
                {metricsData.metrics.slice(-5).reverse().map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="text-sm font-medium">
                        Mode: <span className={`capitalize ${getModeColor(metric.brownout_mode)}`}>
                          {metric.brownout_mode}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{metric.latency_p95}ms</div>
                      <div className="text-xs text-gray-500">
                        {(metric.error_rate * 100).toFixed(1)}% errors
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Loading recent activity...
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current LLM application health</CardDescription>
          </CardHeader>
          <CardContent>
            {status ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Current Mode</span>
                  <span className={`text-sm capitalize ${getModeColor(status.current_mode)}`}>
                    {status.current_mode}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Max Tokens</span>
                  <span className="text-sm">{status.llm_config?.max_tokens || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Temperature</span>
                  <span className="text-sm">{status.llm_config?.temperature || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Complexity</span>
                  <span className="text-sm capitalize">{status.llm_config?.complexity || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Loading system status...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AIAssistant 
        context="dashboard"
        agent={dashboardAgent}
        title="Dashboard AI Assistant"
        placeholder="Ask about your metrics, brownout status, or system performance..."
      />
    </div>
  )
}