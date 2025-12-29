import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Target, Heart, Award } from 'lucide-react'

export default function CompanyPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Building2 className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About AuthApp
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of authentication, making it secure, 
            simple, and accessible for developers worldwide.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription className="text-lg">
                To democratize secure authentication by providing developers with 
                enterprise-grade security tools that are simple to implement and scale.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-primary mb-4" />
              <CardTitle className="text-2xl">Our Values</CardTitle>
              <CardDescription className="text-lg">
                Security first, developer experience, transparency, and building 
                trust through reliable, well-documented solutions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Company Stats */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Trusted by Developers</CardTitle>
            <CardDescription>
              Join the growing community of developers who choose AuthApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">10K+</h3>
                <p className="text-gray-600">Active Developers</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">1M+</h3>
                <p className="text-gray-600">Users Protected</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
                <p className="text-gray-600">Countries</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">99.9%</h3>
                <p className="text-gray-600">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose AuthApp?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best authentication experience for both 
            developers and end users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Industry Leading</CardTitle>
              <CardDescription>
                Recognized by security experts and trusted by Fortune 500 companies 
                for our robust authentication solutions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Developer First</CardTitle>
              <CardDescription>
                Built by developers, for developers. We understand the challenges 
                and provide solutions that just work.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Our roadmap is shaped by community feedback and real-world use cases 
                from our developer community.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
              <CardDescription>
                Have questions about AuthApp or want to learn more about our company?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:hello@authapp.com" className="text-primary hover:underline">
                    hello@authapp.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <strong>Support:</strong>{' '}
                  <a href="mailto:support@authapp.com" className="text-primary hover:underline">
                    support@authapp.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}