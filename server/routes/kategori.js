// Kategori destinasi
const express = require('express');
const db = require('../db');
const { hanyaAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/kategori
router.get('/', async (req, res) => {
  try {
    const hasil = await db.query('SELECT * FROM kategori ORDER BY id_kategori');
    res.json(hasil.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengambil kategori.' });
  }
});

// POST /api/kategori  (admin)
router.post('/', hanyaAdmin, async (req, res) => {
  const nama = (req.body.nama_kategori || '').trim();
  if (!nama) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });

  try {
    const hasil = await db.query(
      'INSERT INTO kategori (nama_kategori) VALUES ($1) RETURNING *', [nama]
    );
    res.status(201).json(hasil.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Kategori sudah ada.' });
    console.log(err);
    res.status(500).json({ message: 'Gagal menambah kategori.' });
  }
});

// PUT /api/kategori/:id  (admin)
router.put('/:id', hanyaAdmin, async (req, res) => {
  const nama = (req.body.nama_kategori || '').trim();
  if (!nama) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });

  try {
    const hasil = await db.query(
      'UPDATE kategori SET nama_kategori = $1 WHERE id_kategori = $2 RETURNING *',
      [nama, req.params.id]
    );
    if (hasil.rows.length === 0) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    res.json(hasil.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Kategori sudah ada.' });
    console.log(err);
    res.status(500).json({ message: 'Gagal mengubah kategori.' });
  }
});

// DELETE /api/kategori/:id  (admin)
router.delete('/:id', hanyaAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM kategori WHERE id_kategori = $1', [req.params.id]);
    res.json({ message: 'Kategori dihapus.' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ message: 'Kategori masih dipakai oleh destinasi.' });
    }
    console.log(err);
    res.status(500).json({ message: 'Gagal menghapus kategori.' });
  }
});

module.exports = router;
