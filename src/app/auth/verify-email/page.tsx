'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AppHeader } from '@/components/app/app-header'
import { AppFooter } from '@/components/app/app-footer'
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react'

function VerifyEmailForm() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [token, setToken] = useState('')
  
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
      // Simulate email verification process
      setTimeout(() => {
        // Mock verification logic - replace with actual API call
        const isValidToken = tokenParam.length > 10 // Simple mock validation
        if (isValidToken) {
          setVerificationStatus('success')
        } else {
          setVerificationStatus('error')
        }
      }, 2000)
    } else {
      setVerificationStatus('error')
    }
  }, [searchParams])

  const handleResendVerification = () => {
    // Handle resend verification logic here
    console.log('Resending verification email')
    setVerificationStatus('loading')
    setTimeout(() => {
      setVerificationStatus('success')
    }, 2000)
  }

  if (verificationStatus === 'loading') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Verifying your email</CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
            <p className="mt-4 text-sm text-gray-600">
              This may take a few moments...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (verificationStatus === 'success') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Email verified!</CardTitle>
          <CardDescription className="text-center">
            Your email address has been successfully verified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-4 text-sm text-gray-600">
              You can now access all features of your account
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">
              Continue to login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Verification failed</CardTitle>
        <CardDescription className="text-center">
          We couldn't verify your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-sm text-gray-600">
            The verification link may have expired or is invalid
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button onClick={handleResendVerification} className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Resend verification email
        </Button>
        <Link href="/auth/login" className="w-full">
          <Button variant="outline" className="w-full">
            Back to login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="text-center">Loading...</div>
            </CardContent>
          </Card>
        }>
          <VerifyEmailForm />
        </Suspense>
      </div>
      <AppFooter />
    </div>
  )
}