'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Settings, User, Shield, Bell, Key, Database, Eye, EyeOff, Copy, Check } from 'lucide-react'
import { mockSettings, mockUser } from '@/lib/mock-data'
import { AIAssistant } from '@/components/console/ai-assistant'
import { aiAgent } from '@/lib/ai-agent'

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [user, setUser] = useState(mockUser)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(settings.integrations.datadog.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleNotification = (type: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <a href="#profile" className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-primary">
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </a>
                <a href="#security" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <Shield className="mr-3 h-4 w-4" />
                  Security
                </a>
                <a href="#notifications" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <Bell className="mr-3 h-4 w-4" />
                  Notifications
                </a>
                <a href="#api" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <Key className="mr-3 h-4 w-4" />
                  API Keys
                </a>
                <a href="#data" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <Database className="mr-3 h-4 w-4" />
                  Data & Privacy
                </a>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card id="profile">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input value={user.name} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Role</label>
                    <Input value={user.role} readOnly />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input value={user.email} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Organization</label>
                  <Input value={user.organization} readOnly />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Member Since</label>
                    <Input value={new Date(user.joinedAt).toLocaleDateString()} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Last Login</label>
                    <Input value={new Date(user.lastLogin).toLocaleString()} readOnly />
                  </div>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="mr-2">Demo Account</Badge>
                  <Badge variant="outline">Read Only</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="security">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-gray-600">Change your account password</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Active Sessions</h3>
                    <p className="text-sm text-gray-600">Manage your active login sessions</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="notifications">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <Button 
                    variant={settings.notifications.email ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleNotification('email')}
                  >
                    {settings.notifications.email ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Incident Alerts</h3>
                    <p className="text-sm text-gray-600">Get notified about system incidents</p>
                  </div>
                  <Button 
                    variant={settings.notifications.incidents ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleNotification('incidents')}
                  >
                    {settings.notifications.incidents ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Brownout Alerts</h3>
                    <p className="text-sm text-gray-600">Notifications when brownout modes activate</p>
                  </div>
                  <Button 
                    variant={settings.notifications.brownouts ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleNotification('brownouts')}
                  >
                    {settings.notifications.brownouts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Cost Alerts</h3>
                    <p className="text-sm text-gray-600">Alerts when token costs exceed thresholds</p>
                  </div>
                  <Button 
                    variant={settings.notifications.costAlerts ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleNotification('costAlerts')}
                  >
                    {settings.notifications.costAlerts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Webhook Notifications</h3>
                    <p className="text-sm text-gray-600">Send notifications to external webhooks</p>
                  </div>
                  <Button 
                    variant={settings.notifications.webhook ? "default" : "outline"} 
                    size="sm"
                    onClick={() => toggleNotification('webhook')}
                  >
                    {settings.notifications.webhook ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="api">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys and access tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">Datadog API Key</h3>
                      <p className="text-sm text-gray-600">Used for monitoring and observability</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={showApiKey ? settings.integrations.datadog.apiKey : '••••••••••••••••••••••••••••••••'}
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyApiKey}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Site: {settings.integrations.datadog.site}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">Gemini API Integration</h3>
                      <p className="text-sm text-gray-600">LLM model configuration</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Configured</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span>{settings.integrations.gemini.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Tokens:</span>
                      <span>{settings.integrations.gemini.maxTokens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {settings.integrations.gemini.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-medium mb-2">Integration Status</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Datadog:</span>
                      <Badge className="ml-2 bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Gemini:</span>
                      <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AIAssistant 
        context="settings"
        agent={aiAgent}
        title="Settings Assistant"
        placeholder="Ask me about configuration, integrations, or account settings..."
      />
    </div>
  )
}