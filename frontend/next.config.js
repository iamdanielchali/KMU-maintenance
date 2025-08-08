/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: ['localhost'],
    },
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/:path*`,
        }, ];
    },
    env: {
        BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
    },
}

module.exports = nextConfig