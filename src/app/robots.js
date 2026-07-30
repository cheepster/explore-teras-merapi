const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://terasmerapi.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
