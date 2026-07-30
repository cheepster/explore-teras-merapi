import { fetchAllItems } from '@/lib/sheets';
import TerasMerapiHome from './TerasMerapiHome';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://terasmerapi.com';

export default async function Page() {
  const items = await fetchAllItems();

  const initialData = { layanan: [], events: [], umkm: [], homestay: [] };
  items.forEach((item) => {
    if (initialData[item.tab]) initialData[item.tab].push(item);
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Teras Merapi',
    description:
      'Desa wisata di lereng Gunung Merapi, Kalitengah Kidul, Glagaharjo, Cangkringan, Sleman, Yogyakarta — wisata alam, UMKM lokal, homestay, dan lava tour jeep.',
    url: SITE_URL,
    image: `${SITE_URL}/assets/hero-poster.webp`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kalitengah Kidul, Glagaharjo, Cangkringan',
      addressRegion: 'Sleman, Daerah Istimewa Yogyakarta',
      addressCountry: 'ID',
    },
    telephone: '+6285290125106',
    sameAs: ['https://www.instagram.com/wisata.terasmerapi'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TerasMerapiHome initialData={initialData} />
    </>
  );
}
