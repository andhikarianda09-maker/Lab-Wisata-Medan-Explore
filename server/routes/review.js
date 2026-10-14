// Review dan rating
const express = require('express');
const db = require('../db');
const { harusLogin, hanyaAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/review  (harus login)
router.post('/', harusLogin, async (req, res) => {
  const { id_destinasi, rating, komentar } = req.body;
  const nilai = parseInt(rating);

  if (!id_destinasi || !(nilai >= 1 && nilai <= 5)) {
    return res.status(400).json({ message: 'Rating harus 1 sampai 5.' });
  }

  try {
    await db.query(
      'INSERT INTO review (id_user, id_destinasi, rating, komentar) VALUES ($1, $2, $3, $4)',
      [req.user.id, id_destinasi, nilai, (komentar || '').trim()]
    );
    res.status(201).json({ message: 'Review berhasil dikirim.' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Anda sudah memberi review untuk destinasi ini.' });
    }
    if (err.code === '23503') {
      return res.status(404).json({ message: 'Destinasi tidak ditemukan.' });
    }
    console.log(err);
    res.status(500).json({ message: 'Gagal mengirim review.' });
  }
});

// GET /api/review  (admin: semua review)
router.get('/', hanyaAdmin, async (req, res) => {
  try {
    const hasil = await db.query(
      `SELECT r.*, u.nama, d.nama_destinasi FROM review r
       JOIN users u ON u.id_user = r.id_user
       JOIN destinasi d ON d.id_destinasi = r.id_destinasi
       ORDER BY r.created_at DESC`
    );
    res.json(hasil.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengambil review.' });
  }
});

// DELETE /api/review/:id  (admin)
router.delete('/:id', hanyaAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM review WHERE id_review = $1', [req.params.id]);
    res.json({ message: 'Review dihapus.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal menghapus review.' });
  }
});

module.exports = router;
