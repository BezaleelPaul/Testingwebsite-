/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  ...(isGitHubPages ? { basePath: '/Testingwebsite-' } : {}),
  env: { NEXT_PUBLIC_SITE_BASE_PATH: isGitHubPages ? '/Testingwebsite-' : '' },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
