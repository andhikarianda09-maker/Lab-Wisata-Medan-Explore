import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Admin from './Admin.jsx';
import AuthModal from './components/AuthModal.jsx';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [tampilLogin, setTampilLogin] = useState(false);

  function handleLogin(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setTampilLogin(false);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  const props = {
    user: user,
    onLoginClick: () => setTampilLogin(true),
    onLogout: handleLogout
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home {...props} />} />
        <Route path="/admin" element={<Admin {...props} />} />
      </Routes>

      {tampilLogin && (
        <AuthModal onClose={() => setTampilLogin(false)} onLogin={handleLogin} />
      )}
    </>
  );
}