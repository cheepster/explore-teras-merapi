export function getDriveUrl(url) {
  if (!url) return '';
  if (/^https?:\/\/lh3\.googleusercontent\.com\//.test(url)) return url;
  if (/^https?:\/\/placehold\.co\//.test(url)) {
    return url.replace(/^(https:\/\/placehold\.co\/\d+x\d+)(\.\w+)?/, '$1.png');
  }
  const idMatch = url.match(/id=([^&]+)/);
  if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
  const dMatch = url.match(/\/file\/d\/([^/]+)/);
  if (dMatch) return `https://drive.google.com/thumbnail?id=${dMatch[1]}&sz=w1000`;
  return url;
}

export function toSlug(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function placeholderImage(text, { w = 600, h = 600, bg = '1C1611', fg = '5B4838' } = {}) {
  return `https://placehold.co/${w}x${h}/${bg}/${fg}.png?text=${encodeURIComponent(text)}`;
}

const FALLBACK_DATA = [
  { tab: 'umkm', id: 'placeholder', kategori: 'Kuliner', nama: 'To be continued.', gambar: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80', galeri: ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80'], foto_menu: '', harga: 'Rp 25k – 75k', kontak: '', alamat: '', jam_buka: '' },
];

export async function fetchAllItems() {
  const url = process.env.NEXT_PUBLIC_SHEETS_URL;
  if (!url) return FALLBACK_DATA;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const text = await res.text();

    const { default: Papa } = await import('papaparse');
    const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });

    const rows = data.map(row => {
      const galeri = ['gambar_1', 'gambar_2', 'gambar_3', 'gambar_4', 'gambar_5']
        .map(col => row[col]?.trim())
        .filter(Boolean)
        .map(url => getDriveUrl(url) || url);

      return {
        tab: row.tab?.trim() || '',
        id: row.id?.trim() || toSlug(row.nama || ''),
        kategori: row.kategori?.trim() || '',
        nama: row.nama?.trim() || '',
        deskripsi:row.deskripsi?.trim() || '',
        gambar: galeri[0] || '',  
        galeri, 
        foto_menu: getDriveUrl(row.foto_menu?.trim()) || row.foto_menu?.trim() || '', 
        harga: row.harga?.trim() || '',
        kontak: row.kontak?.trim() || '',
        alamat: row.alamat?.trim() || '',
        jam_buka: row.jam_buka?.trim() || '',
      };
    }).filter(item => item.tab && item.nama);

    return rows.length > 0 ? rows : FALLBACK_DATA;
  } catch (err) {
    console.error('fetchAllItems error:', err);
    return FALLBACK_DATA;
  }
}

export async function fetchItemBySlug(tab, id) {
  const items = await fetchAllItems();
  return items.find(item => String(item.tab) === String(tab) && String(item.id) === String(id)) || null;
}

export async function fetchProdukByUmkmId(umkmId) {
  const url = process.env.NEXT_PUBLIC_PRODUK_URL;
  if (!url) return [];

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const text = await res.text();

    const { default: Papa } = await import('papaparse');
    const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });

    return data
      .filter(row => String(row.umkm_id?.trim()) === String(umkmId))
      .map(row => ({
        nama:      row.nama?.trim() || '',
        deskripsi: row.deskripsi?.trim() || '',
        harga:     row.harga?.trim() || '',
        gambar:    getDriveUrl(row.gambar?.trim()) || row.gambar?.trim() || '',
      }));
  } catch (err) {
    console.error('fetchProdukByUmkmId error:', err);
    return [];
  }
}