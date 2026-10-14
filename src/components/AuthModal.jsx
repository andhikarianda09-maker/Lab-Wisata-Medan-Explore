import { useState } from 'react';
import { api } from '../api.js';

export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' atau 'register'
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesan, setPesan] = useState('');
  const [sukses, setSukses] = useState(false);

  function gantiMode(m) {
    setMode(m);
    setPesan('');
    setSukses(false);
  }

  async function kirim(event) {
    event.preventDefault();
    setPesan('');
    setSukses(false);

    if (!email.trim() || !password || (mode === 'register' && !nama.trim())) {
      setPesan('Semua kolom wajib diisi.');
      return;
    }

    try {
      if (mode === 'login') {
        const data = await api('/login', 'POST', { email, password });
        onLogin(data);
      } else {
        const data = await api('/register', 'POST', { nama, email, password });
        setMode('login');
        setPassword('');
        setPesan(data.message);
        setSukses(true);
      }
    } catch (err) {
      setPesan(err.message);
    }
  }

  return (
    <div className="auth-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-box">
        <button className="auth-close" aria-label="Tutup" onClick={onClose}>×</button>

        <div className="auth-tabs">
          <button className={'auth-tab' + (mode === 'login' ? ' active' : '')} onClick={() => gantiMode('login')}>
            Login
          </button>
          <button className={'auth-tab' + (mode === 'register' ? ' active' : '')} onClick={() => gantiMode('register')}>
            Daftar
          </button>
        </div>

        <form id="authForm" onSubmit={kirim} noValidate>
          {mode === 'register' && (
            <>
              <label htmlFor="authNama">Nama</label>
              <input id="authNama" type="text" placeholder="Nama lengkap" value={nama} onChange={e => setNama(e.target.value)} />
            </>
          )}

          <label htmlFor="authEmail">Email</label>
          <input id="authEmail" type="email" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} />

          <label htmlFor="authPassword">Password</label>
          <input id="authPassword" type="password" placeholder="Minimal 6 karakter" value={password} onChange={e => setPassword(e.target.value)} />

          <p className={'auth-message' + (sukses ? ' ok' : '')}>{pesan}</p>
          <button type="submit" id="authSubmit">{mode === 'login' ? 'Login' : 'Daftar'}</button>
        </form>
      </div>
    </div>
  );
}
