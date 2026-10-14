import { useState, useEffect } from 'react';
import { api, rupiah, tanggal, teksRating } from '../api.js';

export default function DetailModal({ id, user, onLoginClick, onClose, onReviewBaru }) {
  const [data, setData] = useState(null);
  const [gambarUtama, setGambarUtama] = useState('');
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState('');
  const [pesan, setPesan] = useState('');
  const [sukses, setSukses] = useState(false);

  async function muat() {
    const hasil = await api('/destinasi/' + id);
    setData(hasil);
    setGambarUtama(g => g || hasil.gambar);
  }

  useEffect(() => {
    muat().catch(() => onClose());
  }, [id]);

  async function kirimReview(event) {
    event.preventDefault();
    setPesan('');
    setSukses(false);

    try {
      await api('/review', 'POST', { id_destinasi: id, rating: rating, komentar: komentar });
      setKomentar('');
      setSukses(true);
      setPesan('Terima kasih, review Anda tersimpan.');
      await muat();
      onReviewBaru();
    } catch (err) {
      setPesan(err.message);
    }
  }

  if (!data) return null;

  const punyaMaps = data.maps && data.maps !== '-';
  const fotoLain = [data.gambar, ...data.gallery.map(g => g.gambar)];

  return (
    <div className="detail-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-modal-box">
        <button id="detailClose" onClick={onClose}>×</button>

        <img className="detail-main-image" src={gambarUtama} alt={data.nama_destinasi} />

        {fotoLain.length > 1 && (
          <div className="detail-gallery">
            {fotoLain.map((foto, i) => (
              <img key={i} src={foto} alt="" onClick={() => setGambarUtama(foto)} />
            ))}
          </div>
        )}

        <div className="detail-body">
          <span className="badge">{data.nama_kategori}</span>
          <h2>{data.nama_destinasi}</h2>

          <div className="detail-location-rating">
            <div>📍 <span><small>Lokasi</small><b>{data.lokasi}</b></span></div>
            <div>⭐ <span><small>Rating</small><b>{teksRating(data)}</b></span></div>
          </div>

          <h3>Deskripsi</h3>
          <p>{data.detail_deskripsi || data.deskripsi}</p>

          <div className="detail-info">
            <div>🏛️ <span><small>Kategori</small><b>{data.nama_kategori}</b></span></div>
            <div>🎟️ <span><small>Harga Tiket</small><b>{rupiah(data.harga_tiket)}</b></span></div>
            <div>🕐 <span><small>Jam Operasional</small><b>{data.jam_buka || '-'}</b></span></div>
            <div>📍 <span><small>Alamat</small><b>{data.alamat || '-'}</b></span></div>
            <div>👁️ <span><small>Dilihat</small><b>{data.jumlah_dilihat} kali</b></span></div>
          </div>

          <div className="detail-buttons">
            {punyaMaps && (
              <button id="detailMaps" onClick={() => window.open(data.maps, '_blank')}>
                📍 Lihat di Google Maps →
              </button>
            )}
            <button
              id="detailShare"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link berhasil disalin!');
              }}
            >
              ↗ Bagikan →
            </button>
          </div>

          <h3>Review Pengunjung</h3>

          {user ? (
            <form className="review-form" onSubmit={kirimReview}>
              <label>
                Rating
                <select value={rating} onChange={e => setRating(e.target.value)}>
                  <option value="5">5 - Sangat bagus</option>
                  <option value="4">4 - Bagus</option>
                  <option value="3">3 - Cukup</option>
                  <option value="2">2 - Kurang</option>
                  <option value="1">1 - Buruk</option>
                </select>
              </label>
              <textarea
                rows="3"
                placeholder="Tulis komentar Anda..."
                value={komentar}
                onChange={e => setKomentar(e.target.value)}
              />
              <button type="submit">Kirim Review</button>
              <p className={'auth-message' + (sukses ? ' ok' : '')}>{pesan}</p>
            </form>
          ) : (
            <p className="review-login">
              <button onClick={() => { onClose(); onLoginClick(); }}>Login</button> untuk memberi review.
            </p>
          )}

          {data.review.length === 0 && <p className="review-kosong">Belum ada review. Jadilah yang pertama!</p>}

          {data.review.map(r => (
            <div key={r.id_review} className="review-item">
              <div>
                <b>{r.nama}</b>
                <span className="review-bintang">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <small>{tanggal(r.created_at)}</small>
              </div>
              {r.komentar && <p>{r.komentar}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
