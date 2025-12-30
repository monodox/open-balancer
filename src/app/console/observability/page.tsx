'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, BarChart3, Activity, TrendingUp, Server, Database, Zap, AlertTriangle } from 'lucide-react'
import { mockObservabilityData } from '@/lib/mock-data'
import { AIAssistant } from '@/components/console/ai-assistant'
import { observabilityAgent } from '@/lib/ai-agent'

export default function ObservabilityPage() {
  const [data] = useState(mockObservabilityData)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'degraded': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600'
      case 'WARN': return 'text-yellow-600'
      case 'INFO': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Observability</h1>
        <p className="text-gray-600 mt-2">
          Monitor system performance, logs, and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.services.length}</div>
            <p className="text-xs text-muted-foreground">
              {data.services.filter(s => s.status === 'healthy').length} healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(data.services.reduce((sum, s) => sum + s.avgLatency, 0) / data.services.length)}ms
            </div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.services.reduce((sum, s) => sum + s.requests, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((data.services.reduce((sum, s) => sum + s.errors, 0) / 
                 data.services.reduce((sum, s) => sum + s.requests, 0)) * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall error rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Services Overview</CardTitle>
            <CardDescription>Status and performance of all services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <Badge className={getStatusBadge(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{service.avgLatency}ms avg</div>
                    <div>{service.uptime}% uptime</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Traces</CardTitle>
            <CardDescription>Latest distributed traces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.traces.map((trace) => (
                <div key={trace.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{trace.operation}</div>
                    <div className="text-xs text-gray-500">{trace.service}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className={trace.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {trace.duration}ms
                    </div>
                    <div className="text-xs text-gray-500">{trace.spans} spans</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>Recent application and system logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className="text-xs text-gray-500 w-20">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className={`text-xs font-medium w-12 ${getLogLevelColor(log.level)}`}>
                  {log.level}
                </div>
                <div className="text-xs text-gray-600 w-24">{log.service}</div>
                <div className="text-xs text-gray-900 flex-1">{log.message}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Monitoring Configuration</CardTitle>
          <CardDescription>Configure monitoring and alerting settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Metrics Collection</h3>
              <p className="text-sm text-gray-600 mb-3">Configure which metrics to collect and store</p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Log Aggregation</h3>
              <p className="text-sm text-gray-600 mb-3">Set up log collection and analysis</p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Alert Rules</h3>
              <p className="text-sm text-gray-600 mb-3">Define conditions for automated alerts</p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traces</CardTitle>
            <CardDescription>Distributed tracing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg font-medium mb-2">No trace data</div>
              <p className="text-sm">Distributed traces will appear here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Active monitoring alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg font-medium mb-2">No active alerts</div>
              <p className="text-sm">System alerts will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIAssistant 
        context="observability"
        agent={observabilityAgent}
        title="Observability Assistant"
        placeholder="Ask about your monitoring data, traces, logs, or system health..."
      />
    </div>
  )
}