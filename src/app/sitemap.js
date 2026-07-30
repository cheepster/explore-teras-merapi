import { fetchAllItems } from '@/lib/sheets';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://terasmerapi.com';

export default async function sitemap() {
  const items = await fetchAllItems();

  const itemUrls = items
    .filter((item) => item.tab && item.id)
    .map((item) => ({
      url: `${SITE_URL}/${item.tab}/${item.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...itemUrls,
  ];
}
