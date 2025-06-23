/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'annisadev.com',
      },
    ],
  },
};

export default nextConfig;
