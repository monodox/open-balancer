'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Plus, Filter, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

// Mock data inline
const mockIncidents = [
  {
    id: 'INC-2024-001',
    title: 'High P95 Latency Spike',
    description: 'Sudden increase in response times affecting user experience',
    status: 'resolved',
    severity: 'high',
    priority: 'P1',
    created_at: '2024-01-15T14:30:00Z',
    updated_at: '2024-01-15T15:45:00Z',
    resolved_at: '2024-01-15T15:45:00Z',
    assignee: 'SRE Team',
    tags: ['latency', 'performance', 'brownout'],
    impact: {
      affected_users: 1200,
      revenue_impact: '$2,400',
      duration_minutes: 75
    }
  }
]

export default function IncidentsPage() {
  const [incidents] = useState(mockIncidents)
  const [filter, setFilter] = useState('all')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'investigating': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const openIncidents = incidents.filter(i => i.status !== 'resolved').length
  const inProgress = incidents.filter(i => i.status === 'investigating').length
  const resolvedToday = incidents.filter(i => {
    const today = new Date().toDateString()
    return i.resolved_at && new Date(i.resolved_at).toDateString() === today
  }).length
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incidents</h1>
          <p className="text-gray-600 mt-2">
            Track and manage security incidents and system issues
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Incident
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {openIncidents === 0 ? 'No open incidents' : 'Require attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress}</div>
            <p className="text-xs text-muted-foreground">
              {inProgress === 0 ? 'No incidents in progress' : 'Being investigated'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              {resolvedToday === 0 ? 'No incidents resolved today' : 'Successfully resolved'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total This Month</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground">
              {incidents.length === 0 ? 'No incidents this month' : 'Total incidents'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Latest brownout-related incidents and system issues</CardDescription>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No incidents reported</p>
              <p className="text-sm mb-4">When incidents occur, they will be displayed here</p>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Test Incident
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(incident.status)}
                        <h3 className="font-medium text-gray-900">{incident.title}</h3>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>ID: {incident.id}</span>
                        <span>Created: {new Date(incident.created_at).toLocaleString()}</span>
                        {incident.resolved_at && (
                          <span>Resolved: {new Date(incident.resolved_at).toLocaleString()}</span>
                        )}
                        <span>Assignee: {incident.assignee}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {incident.status}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        Duration: {incident.impact.duration_minutes}min
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Incident Response</CardTitle>
            <CardDescription>Automated response procedures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Auto-escalation</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Notification rules</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Response templates</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Analytics</CardTitle>
            <CardDescription>Trends and patterns in incident data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg font-medium mb-2">No analytics available</div>
              <p className="text-sm">Analytics will appear when incident data is available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}