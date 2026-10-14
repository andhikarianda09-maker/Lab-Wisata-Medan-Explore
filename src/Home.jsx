import { useState, useEffect } from 'react';
import { api } from './api.js';
import Hero from './components/Hero.jsx';
import DestinasiSection from './components/DestinasiSection.jsx';
import TopSection from './components/TopSection.jsx';
import GallerySection from './components/GallerySection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import DetailModal from './components/DetailModal.jsx';

export default function Home({ user, onLoginClick, onLogout }) {
  const [destinasi, setDestinasi] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [top, setTop] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [pilihKategori, setPilihKategori] = useState('Semua');
  const [detailId, setDetailId] = useState(null);

  async function muatData() {
    try {
      const [a, b, c, d] = await Promise.all([
        api('/destinasi'),
        api('/kategori'),
        api('/destinasi/top'),
        api('/gallery')
      ]);
      setDestinasi(a);
      setKategori(b);
      setTop(c);
      setGallery(d);
      setError('');
    } catch (err) {
      setError('Tidak bisa mengambil data dari server. Pastikan server sudah jalan.');
    }
  }

  useEffect(() => {
    muatData();
  }, []);

  function keDestinasi() {
    document.getElementById('destinasi').scrollIntoView({ behavior: 'smooth' });
  }

  function pilihKuliner() {
    setPilihKategori('Kuliner');
    keDestinasi();
  }

  function cariDariHero(kata) {
    setKeyword(kata);
    keDestinasi();
  }

  return (
    <>
      <Hero
        user={user}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
        onKuliner={pilihKuliner}
        onCari={cariDariHero}
      />

      <main>
        {error && <p className="error-banner">{error}</p>}

        <DestinasiSection
          kategori={kategori}
          destinasi={destinasi}
          keyword={keyword}
          setKeyword={setKeyword}
          pilihKategori={pilihKategori}
          setPilihKategori={setPilihKategori}
          onDetail={setDetailId}
        />
        <TopSection top={top} onDetail={setDetailId} />
        <GallerySection gallery={gallery} />
        <ContactSection user={user} destinasi={destinasi} />
      </main>

      <Footer />

      {detailId && (
        <DetailModal
          id={detailId}
          user={user}
          onLoginClick={onLoginClick}
          onClose={() => setDetailId(null)}
          onReviewBaru={muatData}
        />
      )}
    </>
  );
}