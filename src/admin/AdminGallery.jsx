import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function AdminGallery() {
  const [daftar, setDaftar] = useState([]);
  const [destinasi, setDestinasi] = useState([]);
  const [judul, setJudul] = useState('');
  const [gambar, setGambar] = useState('');
  const [idDestinasi, setIdDestinasi] = useState('');
  const [pesan, setPesan] = useState('');

  async function muat() {
    setDaftar(await api('/gallery'));
    setDestinasi(await api('/destinasi'));
  }

  useEffect(() => {
    muat();
  }, []);

  async function tambah(event) {
    event.preventDefault();
    setPesan('');
    try {
      await api('/gallery', 'POST', { judul, gambar, id_destinasi: idDestinasi || null });
      setJudul('');
      setGambar('');
      muat();
    } catch (err) {
      setPesan(err.message);
    }
  }

  async function hapus(item) {
    if (!confirm('Hapus gambar "' + item.judul + '"?')) return;
    await api('/gallery/' + item.id_gallery, 'DELETE');
    muat();
  }

  return (
    <>
      <form className="admin-card admin-form" onSubmit={tambah}>
        <h2>Tambah Gambar</h2>
        <label>Judul
          <input value={judul} onChange={e => setJudul(e.target.value)} />
        </label>
        <label>Link gambar
          <input value={gambar} onChange={e => setGambar(e.target.value)} />
        </label>
        <label>Destinasi
          <select value={idDestinasi} onChange={e => setIdDestinasi(e.target.value)}>
            <option value="">- tidak ada -</option>
            {destinasi.map(d => <option key={d.id_destinasi} value={d.id_destinasi}>{d.nama_destinasi}</option>)}
          </select>
        </label>
        <div className="lebar">
          <button type="submit" className="btn-hijau">Tambah</button>
          <span className="admin-error">{pesan}</span>
        </div>
      </form>

      <div className="admin-card">
        <h2>Gallery ({daftar.length} gambar)</h2>
        <div className="admin-gallery">
          {daftar.map(g => (
            <div key={g.id_gallery} className="admin-foto">
              <img src={g.gambar} alt={g.judul} />
              <p>{g.judul}</p>
              <button className="btn-kecil merah" onClick={() => hapus(g)}>Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
