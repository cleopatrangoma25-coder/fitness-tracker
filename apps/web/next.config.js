/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fitness-tracker/shared', '@fitness-tracker/store', '@fitness-tracker/ui'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig 