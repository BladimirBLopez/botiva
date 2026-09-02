/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-neon'],
  outputFileTracingIncludes: {
    '/api/**/*': [
      './node_modules/.prisma/client/**/*.wasm',
      './node_modules/@prisma/client/**/*.wasm',
    ],
  },
};

module.exports = nextConfig;
