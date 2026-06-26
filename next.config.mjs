/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qtryyswmdsfmukgrxuaq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/hero-images/**',
      },
      {
        protocol: 'https',
        hostname: 'qtryyswmdsfmukgrxuaq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/doctor-assets/**',
      },
      {
        protocol: 'https',
        hostname: 'qtryyswmdsfmukgrxuaq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/article-covers/**',
      },
         {
        protocol: 'https',
        hostname: 'qtryyswmdsfmukgrxuaq.supabase.co',
        port: '',
        pathname: '/**', // matches any path
      },
    ],
  },
};

export default nextConfig;