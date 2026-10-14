import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function AdminKategori() {
  const [daftar, setDaftar] = useState([]);
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');

  async function muat() {
    setDaftar(await api('/kategori'));
  }

  useEffect(() => {
    muat();
  }, []);

  async function tambah(event) {
    event.preventDefault();
    setPesan('');
    try {
      await api('/kategori', 'POST', { nama_kategori: nama });
      setNama('');
      muat();
    } catch (err) {
      setPesan(err.message);
    }
  }

  async function ubah(item) {
    const baru = prompt('Nama kategori baru:', item.nama_kategori);
    if (!baru) return;
    try {
      await api('/kategori/' + item.id_kategori, 'PUT', { nama_kategori: baru });
      muat();
    } catch (err) {
      setPesan(err.message);
    }
  }

  async function hapus(item) {
    if (!confirm('Hapus kategori "' + item.nama_kategori + '"?')) return;
    setPesan('');
    try {
      await api('/kategori/' + item.id_kategori, 'DELETE');
      muat();
    } catch (err) {
      setPesan(err.message);
    }
  }

  return (
    <div className="admin-card admin-tabel">
      <h2>Kategori</h2>

      <form className="admin-baris" onSubmit={tambah}>
        <input placeholder="Nama kategori baru" value={nama} onChange={e => setNama(e.target.value)} />
        <button type="submit" className="btn-hijau">Tambah</button>
      </form>
      <p className="admin-error">{pesan}</p>

      <table>
        <thead><tr><th>Nama kategori</th><th>Aksi</th></tr></thead>
        <tbody>
          {daftar.map(k => (
            <tr key={k.id_kategori}>
              <td>{k.nama_kategori}</td>
              <td>
                <button className="btn-kecil" onClick={() => ubah(k)}>Ubah</button>
                <button className="btn-kecil merah" onClick={() => hapus(k)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
