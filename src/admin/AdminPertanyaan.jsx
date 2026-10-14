import { useState, useEffect } from 'react';
import { api, tanggal } from '../api.js';

export default function AdminPertanyaan() {
  const [daftar, setDaftar] = useState([]);
  const [balasan, setBalasan] = useState({}); // isi balasan per pertanyaan
  const [pesan, setPesan] = useState('');

  async function muat() {
    setDaftar(await api('/pertanyaan'));
  }

  useEffect(() => {
    muat();
  }, []);

  async function ubahStatus(item, status) {
    await api('/pertanyaan/' + item.id_pertanyaan + '/status', 'PUT', { status });
    muat();
  }

  async function kirimBalasan(item) {
    setPesan('');
    try {
      await api('/pertanyaan/' + item.id_pertanyaan + '/balas', 'PUT', {
        balasan: balasan[item.id_pertanyaan]
      });
      muat();
    } catch (err) {
      setPesan(err.message);
    }
  }

  async function hapus(item) {
    if (!confirm('Hapus pertanyaan ini?')) return;
    await api('/pertanyaan/' + item.id_pertanyaan, 'DELETE');
    muat();
  }

  return (
    <div className="admin-card">
      <h2>Pertanyaan ({daftar.length})</h2>
      <p className="admin-error">{pesan}</p>

      {daftar.length === 0 && <p>Belum ada pertanyaan.</p>}

      {daftar.map(p => (
        <div key={p.id_pertanyaan} className="admin-item">
          <div className="admin-item-atas">
            <b>{p.nama_pengirim}</b>
            <small>
              {p.nama_destinasi ? 'tentang ' + p.nama_destinasi : 'pertanyaan umum'} · {tanggal(p.tanggal_kirim)}
            </small>
            <select value={p.status} onChange={e => ubahStatus(p, e.target.value)}>
              <option>Baru</option>
              <option>Dibaca</option>
              <option>Dibalas</option>
            </select>
          </div>

          <p>{p.pesan}</p>

          {p.balasan && (
            <p className="admin-balasan">
              <b>Balasan ({tanggal(p.tanggal_dibalas)}):</b> {p.balasan}
            </p>
          )}

          <textarea
            rows="2"
            placeholder="Tulis balasan..."
            value={balasan[p.id_pertanyaan] ?? ''}
            onChange={e => setBalasan({ ...balasan, [p.id_pertanyaan]: e.target.value })}
          />
          <button className="btn-kecil" onClick={() => kirimBalasan(p)}>Kirim balasan</button>
          <button className="btn-kecil merah" onClick={() => hapus(p)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}
