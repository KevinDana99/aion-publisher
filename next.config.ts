import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lookaside.fbsbx.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.instagram.com',
        pathname: '/**'
      }
    ]
  }
}

export default nextConfig
