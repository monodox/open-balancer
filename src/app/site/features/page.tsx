import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, 
  Users, 
  Zap, 
  Lock, 
  Mail, 
  Smartphone, 
  Globe, 
  BarChart3,
  Settings
} from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Multi-factor authentication, encryption, and compliance with industry standards."
    },
    {
      icon: Users,
      title: "User Management",
      description: "Comprehensive user profiles, roles, and permission management system."
    },
    {
      icon: Zap,
      title: "Fast Integration",
      description: "Simple APIs and SDKs to integrate authentication in minutes, not hours."
    },
    {
      icon: Lock,
      title: "Password Security",
      description: "Secure password policies, reset flows, and breach monitoring."
    },
    {
      icon: Mail,
      title: "Email Verification",
      description: "Automated email verification and notification system."
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Responsive design that works seamlessly across all devices."
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Built to handle millions of users with 99.9% uptime guarantee."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Detailed insights into user behavior and authentication metrics."
    },
    {
      icon: Settings,
      title: "Customizable",
      description: "White-label solutions and customizable authentication flows."
    }
  ]

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build secure, scalable authentication for your applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <IconComponent className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise Ready</CardTitle>
              <CardDescription className="text-lg">
                Built for businesses of all sizes with enterprise-grade security and compliance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-3xl font-bold text-primary mb-2">99.9%</h3>
                  <p className="text-gray-600">Uptime Guarantee</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-primary mb-2">SOC 2</h3>
                  <p className="text-gray-600">Compliant</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-primary mb-2">24/7</h3>
                  <p className="text-gray-600">Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}