import { fetchAllItems, fetchItemBySlug, fetchProdukByUmkmId, placeholderImage } from '@/lib/sheets';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Phone, Tag, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import HeroCarousel from './HeroCarousel';
import { TAB_LABELS } from '@/lib/tabs';

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await fetchAllItems();
  return items.map(item => ({ tab: String(item.tab), id: String(item.id) }));
}

export async function generateMetadata({ params }) {
  const { tab, id } = await params;
  const item = await fetchItemBySlug(tab, id);
  if (!item) {
    return { title: 'Tidak Ditemukan', robots: { index: false, follow: false } };
  }

  const title = `${item.nama} | Teras Merapi`;
  const description = item.deskripsi || `${TAB_LABELS[tab] || tab} di Teras Merapi, Sleman, Yogyakarta.`;
  const image = item.galeri?.[0] || item.gambar;
  const path = `/${tab}/${id}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'article',
      images: image ? [{ url: image, alt: item.nama }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function buildJsonLd(tab, item, path) {
  const base = {
    name: item.nama,
    description: item.deskripsi || undefined,
    image: item.galeri?.[0] || item.gambar || undefined,
    url: path,
    telephone: item.kontak || undefined,
    address: item.alamat || undefined,
  };

  const typeByTab = {
    umkm: 'LocalBusiness',
    homestay: 'LodgingBusiness',
    layanan: 'TouristAttraction',
    events: 'Event',
  };

  return {
    '@context': 'https://schema.org',
    '@type': typeByTab[tab] || 'Thing',
    ...base,
  };
}

function ProdukCard({ produk }) {
  return (
    <div className="break-inside-avoid mb-5">
      <div className="group rounded-xl bg-[#140F0A] border border-[#3D2E1E] overflow-hidden relative cursor-pointer transition-all duration-500 hover:border-[#C97B3A]/40 hover:shadow-[0_0_40px_rgba(201,123,58,0.12)]">
        <div className="w-full relative overflow-hidden bg-[#1C1410] min-h-52 flex items-center justify-center">
          {produk.gambar ? (
            <img
              src={produk.gambar}
              alt={produk.nama}
              loading="lazy"
              decoding="async"
              onError={(e) => { e.currentTarget.src = placeholderImage('Foto Segera Hadir', { w: 600, h: 400, bg: '1C1410', fg: '3D2E1E' }); }}
              className="w-full h-auto min-h-52 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full min-h-52 flex items-center justify-center">
              <ShoppingBag size={32} className="text-[#3D2E1E]" />
            </div>
          )}

          <div className="absolute inset-0 linear-to-t from-[#0D0A08]/90 via-[#0D0A08]/10 to-transparent group-hover:opacity-60 transition-opacity duration-500" />

          <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-500 ease-in-out group-hover:translate-y-full">
            <h3 className="font-serif text-lg text-[#F0E6D3] leading-snug">{produk.nama}</h3>
            {produk.harga && (
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C97B3A] mt-1 inline-block">
                {produk.harga}
              </span>
            )}
          </div>

          <div className="absolute inset-0 p-5 flex flex-col justify-end bg-[#0D0A08]/88 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-10 border-t border-[#C97B3A]/20">
            {produk.harga && (
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C97B3A] mb-3 inline-block">
                {produk.harga}
              </span>
            )}
            <h3 className="font-serif text-lg text-[#F0E6D3] mb-2">{produk.nama}</h3>
            {produk.deskripsi && (
              <p className="font-serif text-sm text-[#A89070] leading-relaxed italic line-clamp-4">{produk.deskripsi}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DetailPage({ params }) {
  const { tab, id } = await params;

  const item = await fetchItemBySlug(tab, id);
  if (!item) notFound();

  const produkList = tab === 'umkm' ? await fetchProdukByUmkmId(id) : [];
  const jsonLd = buildJsonLd(tab, item, `/${tab}/${id}`);

  return (
    <div className="min-h-screen bg-[#0D0A08]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-[#1C1410]">
        <HeroCarousel images={item.galeri} alt={item.nama} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, rgba(13,10,8,0.2) 0%, rgba(13,10,8,0.05) 40%, rgba(13,10,8,1) 100%)'
        }} />

        <Link href="/#explore"
          className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D0A08]/60 border border-[#F0E6D3]/15 backdrop-blur-md text-[#F0E6D3]/70 hover:text-[#F0E6D3] hover:border-[#F0E6D3]/30 transition-all duration-300 font-mono text-xs tracking-[0.15em] uppercase"
        >
          <ArrowLeft size={13} /> Kembali
        </Link>

        <div className="absolute top-6 right-6 z-10">
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C97B3A] border border-[#C97B3A]/40 px-3 py-1 rounded-sm bg-[#0D0A08]/60 backdrop-blur-md">
            {TAB_LABELS[tab] || tab}
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 px-6 md:px-12 pb-8 max-w-5xl mx-auto">
          {item.kategori && (
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C97B3A] mb-3 inline-block">
              {item.kategori}
            </span>
          )}
          <h1 className="font-serif text-4xl md:text-6xl text-[#F0E6D3] leading-tight">
            {item.nama}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <div className="md:col-span-2">
            {item.harga && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C97B3A]/10 border border-[#C97B3A]/30 mb-5">
                <Tag size={13} className="text-[#C97B3A]" />
                <span className="font-mono text-xs tracking-[0.15em] text-[#C97B3A]">{item.harga}</span>
              </div>
            )}
            {item.deskripsi && (
              <p className="font-serif text-lg text-[#A89070] leading-[1.9] italic">{item.deskripsi}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {item.alamat && (
              <div className="flex gap-3 p-4 rounded-xl border border-[#3D2E1E] bg-[#140F0A]">
                <MapPin size={15} className="text-[#C97B3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A89070]/60 mb-1">Lokasi</p>
                  <p className="font-serif text-sm text-[#F0E6D3]">{item.alamat}</p>
                </div>
              </div>
            )}
            {item.jam_buka && (
              <div className="flex gap-3 p-4 rounded-xl border border-[#3D2E1E] bg-[#140F0A]">
                <Clock size={15} className="text-[#C97B3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A89070]/60 mb-1">Jam Buka</p>
                  <p className="font-serif text-sm text-[#F0E6D3]">{item.jam_buka}</p>
                </div>
              </div>
            )}
            {item.kontak && (
              <a
                href={`https://wa.me/${item.kontak.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Halo, saya lihat *${item.nama}* di Teras Merapi. Boleh minta info lebih lanjut?`
                )}`}
                target="_blank" rel="noopener noreferrer"
                className="flex gap-3 p-4 rounded-xl border border-[#3D2E1E] bg-[#140F0A] hover:border-[#C97B3A]/40 transition-colors duration-300 group"
              >
                <Phone size={15} className="text-[#C97B3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A89070]/60 mb-1">Kontak WA</p>
                  <p className="font-serif text-sm text-[#F0E6D3] group-hover:text-[#C97B3A] transition-colors">{item.kontak}</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {tab === 'umkm' && (item.foto_menu || produkList.length > 0) && (
          <div>
            <div className="flex items-center gap-3 mb-8 pb-5 border-b border-[#3D2E1E]">
              <div className="h-px w-8 bg-[#C97B3A]" />
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C97B3A]">Menu & Andalan</span>
              {produkList.length > 0 && (
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#A89070]/40">
                  {produkList.length} menu andalan
                </span>
              )}
            </div>

            <div className={`grid grid-cols-1 ${item.foto_menu ? 'lg:grid-cols-5' : ''} gap-8`}>

              {item.foto_menu && (
                <a
                  href={item.foto_menu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg:col-span-2 group relative block rounded-2xl overflow-hidden border border-[#3D2E1E] bg-[#140F0A] hover:border-[#C97B3A]/40 transition-colors duration-300"
                >
                  <img
                    src={item.foto_menu}
                    alt={`Foto daftar menu ${item.nama}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto max-h-180 object-contain bg-[#0D0A08]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-[#0D0A08]/90 to-transparent flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#A89070]/70">
                      Daftar menu lengkap
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C97B3A] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Lihat penuh →
                    </span>
                  </div>
                </a>
              )}

              <div className={item.foto_menu ? 'lg:col-span-3' : ''}>
                {produkList.length > 0 ? (
                  <div className="columns-1 sm:columns-2 gap-5">
                    {produkList.map((produk, i) => (
                      <ProdukCard key={i} produk={produk} />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 border border-dashed border-[#3D2E1E] rounded-2xl">
                    <ShoppingBag size={32} className="text-[#3D2E1E] mb-3" />
                    <p className="font-serif italic text-[#A89070]/50">Belum ada menu andalan yang disorot.</p>
                    <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#A89070]/30 mt-1">
                      Lihat daftar menu lengkap di samping
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'umkm' && !item.foto_menu && produkList.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[#3D2E1E] rounded-2xl mt-4">
            <ShoppingBag size={36} className="text-[#3D2E1E] mx-auto mb-4" />
            <p className="font-serif italic text-[#A89070]/50 text-lg">Daftar menu belum tersedia.</p>
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#A89070]/30 mt-2">
              Tambahkan foto_menu di sheet, atau isi menu andalan di sheet Produk
            </p>
          </div>
        )}
      </div>
    </div>
  );
}