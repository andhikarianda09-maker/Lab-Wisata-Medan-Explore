export default function TopSection({ top, onDetail }) {
  return (
    <section id="top" className="section soft-section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Favorit Wisatawan</p>
          <h2>Top Destination</h2>
          <p className="section-desc">Destinasi pilihan yang menarik untuk dikunjungi.</p>
        </div>
        <a href="#destinasi" className="see-all">Lihat Semua →</a>
      </div>

      <div className="top-grid">
        {top.map((item, index) => (
          <article
            key={item.id_destinasi}
            className="top-card"
            onClick={() => onDetail(item.id_destinasi)}
          >
            <img src={item.gambar} alt={item.nama_destinasi} loading="lazy" />
            <div className="card-body">
              <span className="rank">{index + 1}</span>
              <h3>{item.nama_destinasi}</h3>
              <div className="location">{item.nama_kategori}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
