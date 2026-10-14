import { teksRating } from '../api.js';

export default function DestinasiSection({
  kategori, destinasi, keyword, setKeyword, pilihKategori, setPilihKategori, onDetail
}) {
  const hasil = destinasi.filter(item => {
    const cocokKategori = pilihKategori === 'Semua' || item.nama_kategori === pilihKategori;
    const cocokCari = item.nama_destinasi.toLowerCase().includes(keyword.toLowerCase().trim());
    return cocokKategori && cocokCari;
  });

  return (
    <section id="destinasi" className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Jelajahi Medan</p>
          <h2>Kategori Destinasi</h2>
        </div>
      </div>

      <div className="filter-row">
        <button
          className={'filter-btn' + (pilihKategori === 'Semua' ? ' active' : '')}
          onClick={() => setPilihKategori('Semua')}
        >
          Semua
        </button>
        {kategori.map(k => (
          <button
            key={k.id_kategori}
            className={'filter-btn' + (pilihKategori === k.nama_kategori ? ' active' : '')}
            onClick={() => setPilihKategori(k.nama_kategori)}
          >
            {k.nama_kategori}
          </button>
        ))}
      </div>

      <div className="section-title-row">
        <div>
          <p className="eyebrow">Tempat Pilihan</p>
          <h2>Destinasi Wisata</h2>
        </div>
        <div className="small-search">
          <span>⌕</span>
          <input
            id="searchInput"
            type="text"
            placeholder="Cari nama destinasi..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="destination-grid">
        {hasil.length === 0 && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#81928c' }}>
            Destinasi tidak ditemukan.
          </p>
        )}

        {hasil.map(item => (
          <article
            key={item.id_destinasi}
            className="destination-card"
            onClick={() => onDetail(item.id_destinasi)}
          >
            <img src={item.gambar} alt={item.nama_destinasi} loading="lazy" />
            <div className="card-body">
              <span className="badge">{item.nama_kategori}</span>
              <h3>{item.nama_destinasi}</h3>
              <div className="location">Lokasi: {item.lokasi}</div>
              <div className="card-rating">⭐ {teksRating(item)}</div>
              <p>{item.deskripsi}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
