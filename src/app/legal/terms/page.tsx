import { AppHeader } from '@/components/app/app-header'
import { AppFooter } from '@/components/app/app-footer'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-gray-600">
              Last updated: December 29, 2024
            </p>
          </div>

          <Card>
            <CardContent className="prose max-w-none p-8">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                  <p className="text-gray-600">
                    By accessing and using AuthApp, you accept and agree to be bound by the terms and 
                    provision of this agreement. If you do not agree to abide by the above, please do 
                    not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use License</h2>
                  <p className="text-gray-600">
                    Permission is granted to temporarily use AuthApp for personal, non-commercial 
                    transitory viewing only. This is the grant of a license, not a transfer of title, 
                    and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
                  <p className="text-gray-600">
                    When you create an account with us, you must provide information that is accurate, 
                    complete, and current at all times. You are responsible for safeguarding the password 
                    and for all activities that occur under your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Privacy Policy</h2>
                  <p className="text-gray-600">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs 
                    your use of the Service, to understand our practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Termination</h2>
                  <p className="text-gray-600">
                    We may terminate or suspend your account and bar access to the Service immediately, 
                    without prior notice or liability, under our sole discretion, for any reason whatsoever 
                    and without limitation.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Information</h2>
                  <p className="text-gray-600">
                    If you have any questions about these Terms of Service, please contact us at{' '}
                    <a href="mailto:legal@authapp.com" className="text-primary hover:underline">
                      legal@authapp.com
                    </a>
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AppFooter />
    </div>
  )
}