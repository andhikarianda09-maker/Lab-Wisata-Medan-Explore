// Gallery
const express = require('express');
const db = require('../db');
const { hanyaAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const hasil = await db.query(
      `SELECT g.*, d.nama_destinasi FROM gallery g
       LEFT JOIN destinasi d ON d.id_destinasi = g.id_destinasi
       ORDER BY g.id_gallery`
    );
    res.json(hasil.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengambil gallery.' });
  }
});

// POST /api/gallery  (admin)
router.post('/', hanyaAdmin, async (req, res) => {
  const { judul, gambar, id_destinasi } = req.body;
  if (!judul || !gambar) {
    return res.status(400).json({ message: 'Judul dan link gambar wajib diisi.' });
  }
  try {
    const hasil = await db.query(
      'INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ($1, $2, $3) RETURNING *',
      [judul, gambar, id_destinasi || null]
    );
    res.status(201).json(hasil.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal menambah gambar.' });
  }
});

// DELETE /api/gallery/:id  (admin)
router.delete('/:id', hanyaAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM gallery WHERE id_gallery = $1', [req.params.id]);
    res.json({ message: 'Gambar dihapus.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal menghapus gambar.' });
  }
});

module.exports = router;
