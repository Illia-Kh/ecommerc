/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['cs', 'uk'],
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'cs',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
