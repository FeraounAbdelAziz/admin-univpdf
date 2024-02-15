/** @type {import('next').NextConfig} */
const nextConfig = {

  experimental: {
    serverActions: { 
      bodySizeLimit : '40mb'
    },
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', 'mantine-react-table'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh'
      }
    ]
  }
};

export default nextConfig;
