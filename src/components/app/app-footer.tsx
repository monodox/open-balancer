import Link from 'next/link'
import { Building2 } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gray-900">open-Balancer</span>
            </Link>
            <p className="text-sm text-gray-600 max-w-md">
              Adaptive control layer for Gemini-powered LLM applications with AI brownout strategies.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-sm text-gray-600 hover:text-gray-900">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/organisation" className="text-sm text-gray-600 hover:text-gray-900">
                  Organizations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8">
          <p className="text-sm text-gray-600 text-center">
            © 2024 open-Balancer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}