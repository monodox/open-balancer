'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AppHeader } from '@/components/app/app-header'
import { AppFooter } from '@/components/app/app-footer'
import { Building, Plus, Users, ArrowRight, Hash } from 'lucide-react'

export default function OrganisationPage() {
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join')
  const [joinCode, setJoinCode] = useState('')
  const [orgName, setOrgName] = useState('')
  const [orgDescription, setOrgDescription] = useState('')

  const handleJoinOrg = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Joining organization with code:', joinCode)
    // Handle join organization logic
  }

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating organization:', { orgName, orgDescription })
    // Handle create organization logic
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Building className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Join Your Organization</h1>
            <p className="mt-2 text-gray-600">
              Join an existing organization or create a new one to get started
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'join'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Join Organization
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Organization
            </button>
          </div>

          {/* Join Organization Tab */}
          {activeTab === 'join' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Join an Organization
                </CardTitle>
                <CardDescription>
                  Enter the invitation code provided by your organization admin
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleJoinOrg}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="joinCode" className="text-sm font-medium">
                      Organization Code
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="joinCode"
                        type="text"
                        placeholder="Enter organization code (e.g., ABC123)"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Don't have a code? Contact your organization administrator
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Join Organization
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Create Organization Tab */}
          {activeTab === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Organization
                </CardTitle>
                <CardDescription>
                  Set up a new organization and invite your team members
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateOrg}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="orgName" className="text-sm font-medium">
                      Organization Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="orgName"
                        type="text"
                        placeholder="Enter organization name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="orgDescription" className="text-sm font-medium">
                      Description (Optional)
                    </label>
                    <textarea
                      id="orgDescription"
                      placeholder="Brief description of your organization"
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Your organization will be created instantly</li>
                      <li>• You'll receive an invitation code to share with team members</li>
                      <li>• You can manage members and settings from the dashboard</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Organization
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <Link href="/help" className="text-primary hover:underline">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  )
}