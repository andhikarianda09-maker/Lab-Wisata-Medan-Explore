import { useState, useEffect } from 'react';
import { api, rupiah } from '../api.js';

const KOSONG = {
  nama_destinasi: '', id_kategori: '', lokasi: '', alamat: '', deskripsi: '',
  detail_deskripsi: '', gambar: '', sumber_gambar: '', jam_buka: '',
  harga_tiket: 0, maps: '', is_top: false
};

export default function AdminDestinasi() {
  const [daftar, setDaftar] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [form, setForm] = useState(KOSONG);
  const [editId, setEditId] = useState(null);
  const [pesan, setPesan] = useState('');

  async function muat() {
    setDaftar(await api('/destinasi'));
    setKategori(await api('/kategori'));
  }

  useEffect(() => {
    muat();
  }, []);

  function isi(nama, nilai) {
    setForm({ ...form, [nama]: nilai });
  }

  async function simpan(event) {
    event.preventDefault();
    setPesan('');
    try {
      if (editId) {
        await api('/destinasi/' + editId, 'PUT', form);
      } else {
        await api('/destinasi', 'POST', form);
      }
      setForm(KOSONG);
      setEditId(null);
      muat();
    } catch (err) {
      setPesan(err.message);
    }
  }

  function edit(item) {
    setEditId(item.id_destinasi);
    setForm({
      nama_destinasi: item.nama_destinasi, id_kategori: item.id_kategori || '',
      lokasi: item.lokasi || '', alamat: item.alamat || '', deskripsi: item.deskripsi || '',
      detail_deskripsi: item.detail_deskripsi || '', gambar: item.gambar || '',
      sumber_gambar: item.sumber_gambar || '', jam_buka: item.jam_buka || '',
      harga_tiket: item.harga_tiket || 0, maps: item.maps || '', is_top: item.is_top
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function hapus(item) {
    if (!confirm('Hapus destinasi "' + item.nama_destinasi + '"?')) return;
    try {
      await api('/destinasi/' + item.id_destinasi, 'DELETE');
      muat();
    } catch (err) {
      setPesan(err.message);
    }
  }

  async function ubahTop(item) {
    await api('/destinasi/' + item.id_destinasi, 'PUT', { ...item, is_top: !item.is_top });
    muat();
  }

  return (
    <>
      <form className="admin-card admin-form" onSubmit={simpan}>
        <h2>{editId ? 'Ubah Destinasi' : 'Tambah Destinasi'}</h2>

        <label>Nama destinasi *
          <input value={form.nama_destinasi} onChange={e => isi('nama_destinasi', e.target.value)} />
        </label>
        <label>Kategori
          <select value={form.id_kategori} onChange={e => isi('id_kategori', e.target.value)}>
            <option value="">- pilih -</option>
            {kategori.map(k => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
          </select>
        </label>
        <label>Lokasi
          <input value={form.lokasi} onChange={e => isi('lokasi', e.target.value)} />
        </label>
        <label>Alamat
          <input value={form.alamat} onChange={e => isi('alamat', e.target.value)} />
        </label>
        <label>Link gambar
          <input value={form.gambar} onChange={e => isi('gambar', e.target.value)} />
        </label>
        <label>Sumber gambar
          <input value={form.sumber_gambar} onChange={e => isi('sumber_gambar', e.target.value)} />
        </label>
        <label>Jam buka
          <input value={form.jam_buka} onChange={e => isi('jam_buka', e.target.value)} placeholder="08.00 - 17.00 WIB" />
        </label>
        <label>Harga tiket (Rp, 0 = gratis)
          <input type="number" min="0" value={form.harga_tiket} onChange={e => isi('harga_tiket', e.target.value)} />
        </label>
        <label>Link Google Maps
          <input value={form.maps} onChange={e => isi('maps', e.target.value)} />
        </label>
        <label className="admin-centang">
          <input type="checkbox" checked={form.is_top} onChange={e => isi('is_top', e.target.checked)} />
          Tandai sebagai Top Destination
        </label>
        <label className="lebar">Deskripsi singkat
          <textarea rows="2" value={form.deskripsi} onChange={e => isi('deskripsi', e.target.value)} />
        </label>
        <label className="lebar">Deskripsi lengkap
          <textarea rows="4" value={form.detail_deskripsi} onChange={e => isi('detail_deskripsi', e.target.value)} />
        </label>

        <div className="lebar">
          <button type="submit" className="btn-hijau">{editId ? 'Simpan perubahan' : 'Tambah'}</button>
          {editId && (
            <button type="button" className="btn-garis gelap" onClick={() => { setEditId(null); setForm(KOSONG); }}>
              Batal
            </button>
          )}
          <span className="admin-error">{pesan}</span>
        </div>
      </form>

      <div className="admin-card admin-tabel">
        <h2>Daftar Destinasi ({daftar.length})</h2>
        <table>
          <thead>
            <tr><th>Nama</th><th>Kategori</th><th>Tiket</th><th>Rating</th><th>Dilihat</th><th>Top</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {daftar.map(d => (
              <tr key={d.id_destinasi}>
                <td>{d.nama_destinasi}</td>
                <td>{d.nama_kategori}</td>
                <td>{rupiah(d.harga_tiket)}</td>
                <td>{d.jumlah_review ? d.rata_rating + ' (' + d.jumlah_review + ')' : '-'}</td>
                <td>{d.jumlah_dilihat}</td>
                <td><input type="checkbox" checked={d.is_top} onChange={() => ubahTop(d)} /></td>
                <td>
                  <button className="btn-kecil" onClick={() => edit(d)}>Ubah</button>
                  <button className="btn-kecil merah" onClick={() => hapus(d)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
