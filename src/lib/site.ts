const productionSite = 'https://bezaleelpaul-portfolio-demo.vercel.app';

export const SITE_URL =
  process.env.VERCEL_ENV === 'production'
    ? productionSite
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : productionSite;
