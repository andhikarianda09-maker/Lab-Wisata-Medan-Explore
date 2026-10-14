// Pertanyaan dari pengunjung
const express = require('express');
const db = require('../db');
const { loginOpsional, hanyaAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/pertanyaan  (siapa saja boleh kirim)
router.post('/', loginOpsional, async (req, res) => {
  const nama = (req.body.nama_pengirim || '').trim();
  const pesan = (req.body.pesan || '').trim();

  if (!nama || !pesan) {
    return res.status(400).json({ message: 'Nama dan pesan wajib diisi.' });
  }

  try {
    await db.query(
      `INSERT INTO pertanyaan (id_destinasi, id_user, nama_pengirim, pesan)
       VALUES ($1, $2, $3, $4)`,
      [req.body.id_destinasi || null, req.user ? req.user.id : null, nama, pesan]
    );
    res.status(201).json({ message: 'Pesan berhasil dikirim.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengirim pesan.' });
  }
});

// GET /api/pertanyaan  (admin)
router.get('/', hanyaAdmin, async (req, res) => {
  try {
    const hasil = await db.query(
      `SELECT p.*, d.nama_destinasi FROM pertanyaan p
       LEFT JOIN destinasi d ON d.id_destinasi = p.id_destinasi
       ORDER BY p.tanggal_kirim DESC`
    );
    res.json(hasil.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengambil pertanyaan.' });
  }
});

// PUT /api/pertanyaan/:id/balas  (admin) -> status otomatis "Dibalas"
router.put('/:id/balas', hanyaAdmin, async (req, res) => {
  const balasan = (req.body.balasan || '').trim();
  if (!balasan) return res.status(400).json({ message: 'Balasan wajib diisi.' });

  try {
    await db.query(
      `UPDATE pertanyaan SET balasan = $1, status = 'Dibalas', tanggal_dibalas = NOW()
       WHERE id_pertanyaan = $2`,
      [balasan, req.params.id]
    );
    res.json({ message: 'Balasan tersimpan.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal menyimpan balasan.' });
  }
});

// PUT /api/pertanyaan/:id/status  (admin)
router.put('/:id/status', hanyaAdmin, async (req, res) => {
  const status = req.body.status;
  if (!['Baru', 'Dibaca', 'Dibalas'].includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' });
  }
  try {
    await db.query('UPDATE pertanyaan SET status = $1 WHERE id_pertanyaan = $2', [status, req.params.id]);
    res.json({ message: 'Status diubah.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengubah status.' });
  }
});

// DELETE /api/pertanyaan/:id  (admin)
router.delete('/:id', hanyaAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM pertanyaan WHERE id_pertanyaan = $1', [req.params.id]);
    res.json({ message: 'Pertanyaan dihapus.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal menghapus pertanyaan.' });
  }
});

module.exports = router;
