// Fungsi kecil untuk memanggil API server
export async function api(url, method = 'GET', body) {
  const token = localStorage.getItem('token');

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;

  const res = await fetch('/api' + url, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.');
  return data;
}

export function rupiah(angka) {
  if (!angka) return 'Gratis';
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

export function tanggal(teks) {
  if (!teks) return '-';
  return new Date(teks).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function teksRating(item) {
  if (!item.jumlah_review) return 'Belum ada review';
  return item.rata_rating + ' (' + item.jumlah_review + ' review)';
}