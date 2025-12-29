import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Code, 
  MessageCircle, 
  FileText, 
  Video, 
  Users,
  ExternalLink,
  Download
} from 'lucide-react'

export default function ResourcesPage() {
  const resourceCategories = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Comprehensive guides and API references",
      items: [
        "Getting Started Guide",
        "API Reference",
        "Integration Examples",
        "Best Practices"
      ]
    },
    {
      icon: Code,
      title: "Developer Tools",
      description: "SDKs, libraries, and development resources",
      items: [
        "JavaScript SDK",
        "Python SDK",
        "React Components",
        "Code Examples"
      ]
    },
    {
      icon: Video,
      title: "Tutorials",
      description: "Step-by-step video guides and walkthroughs",
      items: [
        "Quick Start Videos",
        "Integration Tutorials",
        "Security Best Practices",
        "Troubleshooting Guide"
      ]
    },
    {
      icon: MessageCircle,
      title: "Community",
      description: "Connect with other developers and get support",
      items: [
        "Developer Forum",
        "Discord Community",
        "Stack Overflow",
        "GitHub Discussions"
      ]
    }
  ]

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Developer Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to integrate AuthApp into your applications, 
            from documentation to community support.
          </p>
        </div>

          {/* Resource Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {resourceCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <IconComponent className="h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Links */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">API Docs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Code className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">GitHub</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Download className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">SDKs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Join Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support Section */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Need Help?</CardTitle>
              <CardDescription>
                Our support team is here to help you succeed with AuthApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get instant help from our support team
                  </p>
                  <Button variant="outline" size="sm">Start Chat</Button>
                </div>
                <div>
                  <FileText className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Documentation</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Find answers in our comprehensive docs
                  </p>
                  <Button variant="outline" size="sm">Browse Docs</Button>
                </div>
                <div>
                  <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with other developers
                  </p>
                  <Button variant="outline" size="sm">Join Community</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}