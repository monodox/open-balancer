import { AppHeader } from '@/components/app/app-header'
import { AppFooter } from '@/components/app/app-footer'
import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-gray-600">
              Last updated: December 29, 2024
            </p>
          </div>

          <Card>
            <CardContent className="prose max-w-none p-8">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
                  <p className="text-gray-600">
                    We collect information you provide directly to us, such as when you create an account, 
                    update your profile, or contact us for support.
                  </p>
                  <div className="mt-3">
                    <h3 className="font-medium text-gray-900">Personal Information</h3>
                    <ul className="list-disc list-inside mt-1 text-gray-600 space-y-1">
                      <li>Name and email address</li>
                      <li>Account credentials</li>
                      <li>Organization information</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
                  <p className="text-gray-600">
                    We use the information we collect to provide, maintain, and improve our services, 
                    including to:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>Create and manage your account</li>
                    <li>Provide customer support</li>
                    <li>Send important notifications about your account</li>
                    <li>Improve our services and user experience</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Information Sharing</h2>
                  <p className="text-gray-600">
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as described in this policy. We may share your information:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>With your consent</li>
                    <li>To comply with legal requirements</li>
                    <li>To protect our rights and safety</li>
                    <li>With service providers who assist us in operating our platform</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h2>
                  <p className="text-gray-600">
                    We implement appropriate technical and organizational measures to protect your personal 
                    information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h2>
                  <p className="text-gray-600">
                    You have the right to access, update, or delete your personal information. You may also 
                    opt out of certain communications from us. To exercise these rights, please contact us 
                    using the information below.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
                  <p className="text-gray-600">
                    We may update this Privacy Policy from time to time. We will notify you of any changes 
                    by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                  <p className="text-gray-600">
                    If you have any questions about this Privacy Policy, please contact us at{' '}
                    <a href="mailto:privacy@authapp.com" className="text-primary hover:underline">
                      privacy@authapp.com
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