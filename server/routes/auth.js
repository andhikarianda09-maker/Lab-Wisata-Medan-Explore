// Register dan Login
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// POST /api/register  (selalu jadi "pengunjung")
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter.' });
  }

  try {
    const cek = await db.query('SELECT id_user FROM users WHERE email = $1', [email]);
    if (cek.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (nama, email, password) VALUES ($1, $2, $3)',
      [nama, email, passwordHash]
    );

    res.status(201).json({ message: 'Pendaftaran berhasil. Silakan login.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// POST /api/login  (pengunjung dan admin memakai ini)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });
  }

  try {
    const hasil = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = hasil.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: token,
      user: { id_user: user.id_user, nama: user.nama, email: user.email, role: user.role }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

module.exports = router;
