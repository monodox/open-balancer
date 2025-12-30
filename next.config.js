/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ]
  },
  webpack: (config) => {
    // Suppress webpack warnings about TypeScript path resolution
    config.infrastructureLogging = {
      level: 'error'
    }
    return config
  }
}

module.exports = nextConfig