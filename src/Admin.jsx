import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminDestinasi from './admin/AdminDestinasi.jsx';
import AdminKategori from './admin/AdminKategori.jsx';
import AdminGallery from './admin/AdminGallery.jsx';
import AdminPertanyaan from './admin/AdminPertanyaan.jsx';
import AdminReview from './admin/AdminReview.jsx';

const MENU = ['Destinasi', 'Kategori', 'Gallery', 'Pertanyaan', 'Review'];

export default function Admin({ user, onLoginClick, onLogout }) {
  const [tab, setTab] = useState('Destinasi');

  // Hanya admin yang boleh masuk
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-page">
        <div className="admin-card admin-tolak">
          <h2>Dashboard Admin</h2>
          <p>Halaman ini khusus admin. Silakan login dengan akun admin.</p>
          <button className="btn-hijau" onClick={onLoginClick}>Login</button>
          <p><Link to="/">← Kembali ke website</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-top">
        <h1>Dashboard Admin</h1>
        <div>
          <span>{user.nama}</span>
          <Link to="/" className="btn-garis">Lihat website</Link>
          <button className="btn-garis" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="admin-tabs">
        {MENU.map(m => (
          <button key={m} className={tab === m ? 'active' : ''} onClick={() => setTab(m)}>{m}</button>
        ))}
      </div>

      {tab === 'Destinasi' && <AdminDestinasi />}
      {tab === 'Kategori' && <AdminKategori />}
      {tab === 'Gallery' && <AdminGallery />}
      {tab === 'Pertanyaan' && <AdminPertanyaan />}
      {tab === 'Review' && <AdminReview />}
    </div>
  );
}