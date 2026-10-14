import { useState } from 'react';

export default function GallerySection({ gallery }) {
  const [gambarBesar, setGambarBesar] = useState(null);

  return (
    <section id="gallery" className="section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Dokumentasi</p>
          <h2>Galeri Medan</h2>
          <p className="section-desc">Jelajahi momen indah dari berbagai destinasi di Kota Medan.</p>
        </div>
      </div>

      <div className="gallery-grid">
        {gallery.map(item => (
          <div key={item.id_gallery} className="gallery-item" onClick={() => setGambarBesar(item)}>
            <img src={item.gambar} alt={item.judul} loading="lazy" />
          </div>
        ))}
      </div>

      {gambarBesar && (
        <div className="modal" onClick={() => setGambarBesar(null)}>
          <button className="modal-close" onClick={() => setGambarBesar(null)}>×</button>
          <img src={gambarBesar.gambar} alt={gambarBesar.judul} onClick={e => e.stopPropagation()} />
          <p>{gambarBesar.judul}</p>
        </div>
      )}
    </section>
  );
}
