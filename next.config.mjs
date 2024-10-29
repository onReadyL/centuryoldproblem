/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 Edge Runtime
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'your-production-domain.vercel.app'],
    },
  },
  // 添加环境变量
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

export default nextConfig;
