/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error'
    }
    return config
  }
}

module.exports = nextConfig