/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/merchant/:path*',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'product' }],
        destination: '/pay',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'amount' }],
        destination: '/pay',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
