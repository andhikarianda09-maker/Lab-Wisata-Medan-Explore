import { useState, useEffect } from 'react';
import { api, tanggal } from '../api.js';

export default function AdminReview() {
  const [daftar, setDaftar] = useState([]);

  async function muat() {
    setDaftar(await api('/review'));
  }

  useEffect(() => {
    muat();
  }, []);

  async function hapus(item) {
    if (!confirm('Hapus review dari ' + item.nama + '?')) return;
    await api('/review/' + item.id_review, 'DELETE');
    muat();
  }

  return (
    <div className="admin-card admin-tabel">
      <h2>Review ({daftar.length})</h2>

      {daftar.length === 0 && <p>Belum ada review.</p>}

      {daftar.length > 0 && (
        <table>
          <thead>
            <tr><th>Pengunjung</th><th>Destinasi</th><th>Rating</th><th>Komentar</th><th>Tanggal</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {daftar.map(r => (
              <tr key={r.id_review}>
                <td>{r.nama}</td>
                <td>{r.nama_destinasi}</td>
                <td>{r.rating} ★</td>
                <td>{r.komentar}</td>
                <td>{tanggal(r.created_at)}</td>
                <td><button className="btn-kecil merah" onClick={() => hapus(r)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
