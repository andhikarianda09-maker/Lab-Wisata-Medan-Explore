import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Hero({ user, onLoginClick, onLogout, onKuliner, onCari }) {
  const [kata, setKata] = useState('');

  function klikKuliner(event) {
    event.preventDefault();
    onKuliner();
  }

  function fokusCari() {
    document.getElementById('destinasi').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('searchInput').focus();
  }

  return (
    <header id="home" className="hero">
      <nav className="navbar">
        <a href="#home" className="logo">
          <span className="logo-mark">ME</span>
          <span><b>Medan</b><em>Explore</em></span>
        </a>

        <div className="nav-links">
          <a className="active" href="#home">Home</a>
          <a href="#destinasi">Destinasi</a>
          <a href="#destinasi" onClick={klikKuliner}>Kuliner</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-right">
          {user && <span className="nav-user">Halo, {user.nama}</span>}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="login-btn">Dashboard</Link>
          )}
          {user ? (
            <button className="login-btn" onClick={onLogout}>Logout</button>
          ) : (
            <button className="login-btn" onClick={onLoginClick}>Login</button>
          )}
          <button className="search-icon" aria-label="Cari" onClick={fokusCari}>⌕</button>
        </div>
      </nav>

      <div className="hero-content">
        <p className="script-title">Explore</p>
        <h1>Medan</h1>
        <p className="hero-text">
          Temukan keindahan, sejarah, budaya, dan cita rasa unik Kota Medan dan sekitarnya.
        </p>

        <div className="hero-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Cari destinasi..."
            value={kata}
            onChange={e => setKata(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onCari(kata)}
          />
          <button onClick={() => onCari(kata)}>Cari</button>
        </div>
      </div>
    </header>
  );
}
