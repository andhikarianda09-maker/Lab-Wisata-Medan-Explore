// Destinasi wisata
const express = require('express');
const db = require('../db');
const { hanyaAdmin } = require('../middleware/auth');

const router = express.Router();

// Query dasar: destinasi + nama kategori + rata-rata rating dari review
const QUERY_DASAR = `
  SELECT d.*, k.nama_kategori,
         COALESCE(ROUND(AVG(r.rating), 1), 0)::float AS rata_rating,
         COUNT(r.id_review)::int AS jumlah_review
  FROM destinasi d
  LEFT JOIN kategori k ON k.id_kategori = d.id_kategori
  LEFT JOIN review r ON r.id_destinasi = d.id_destinasi
`;
const GROUP = ' GROUP BY d.id_destinasi, k.nama_kategori ';

// GET /api/destinasi  -> semua destinasi
router.get('/', async (req, res) => {
  try {
    const hasil = await db.query(QUERY_DASAR + GROUP + ' ORDER BY d.id_destinasi');
    res.json(hasil.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengambil data destinasi.' });
  }
});

// GET /api/destinasi/top  -> 5 destinasi: yang ditandai admin dulu, lalu rating tertinggi
router.get('/top', async (req, res) => {
  try {
    const hasil = await db.query(
      QUERY_DASAR + GROUP + ' ORDER BY d.is_top DESC, rata_rating DESC, d.id_destinasi LIMIT 5'
    );
    res.json(hasil.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengambil top destinasi.' });
  }
});

// GET /api/destinasi/:id  -> detail + gallery + review (jumlah_dilihat bertambah)
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(404).json({ message: 'Destinasi tidak ditemukan.' });

  try {
    await db.query('UPDATE destinasi SET jumlah_dilihat = jumlah_dilihat + 1 WHERE id_destinasi = $1', [id]);

    const detail = await db.query(QUERY_DASAR + ' WHERE d.id_destinasi = $1 ' + GROUP, [id]);
    if (detail.rows.length === 0) {
      return res.status(404).json({ message: 'Destinasi tidak ditemukan.' });
    }

    const gallery = await db.query(
      'SELECT * FROM gallery WHERE id_destinasi = $1 ORDER BY id_gallery', [id]
    );
    const review = await db.query(
      `SELECT r.*, u.nama FROM review r
       JOIN users u ON u.id_user = r.id_user
       WHERE r.id_destinasi = $1 ORDER BY r.created_at DESC`, [id]
    );

    res.json({ ...detail.rows[0], gallery: gallery.rows, review: review.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengambil detail destinasi.' });
  }
});

// Merapikan data kiriman dari form admin
function ambilData(body) {
  return [
    body.nama_destinasi,
    body.lokasi || '',
    body.deskripsi || '',
    body.detail_deskripsi || '',
    body.gambar || '',
    body.sumber_gambar || '',
    body.jam_buka || '',
    parseInt(body.harga_tiket) || 0,
    body.alamat || '',
    body.maps || '',
    body.is_top === true || body.is_top === 'true',
    body.id_kategori || null
  ];
}

// POST /api/destinasi  (admin)
router.post('/', hanyaAdmin, async (req, res) => {
  if (!req.body.nama_destinasi) {
    return res.status(400).json({ message: 'Nama destinasi wajib diisi.' });
  }
  try {
    const hasil = await db.query(
      `INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar,
        sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      ambilData(req.body)
    );
    res.status(201).json(hasil.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal menambah destinasi.' });
  }
});

// PUT /api/destinasi/:id  (admin)
router.put('/:id', hanyaAdmin, async (req, res) => {
  if (!req.body.nama_destinasi) {
    return res.status(400).json({ message: 'Nama destinasi wajib diisi.' });
  }
  try {
    const hasil = await db.query(
      `UPDATE destinasi SET nama_destinasi=$1, lokasi=$2, deskripsi=$3, detail_deskripsi=$4,
        gambar=$5, sumber_gambar=$6, jam_buka=$7, harga_tiket=$8, alamat=$9, maps=$10,
        is_top=$11, id_kategori=$12, updated_at=NOW()
       WHERE id_destinasi=$13 RETURNING *`,
      [...ambilData(req.body), req.params.id]
    );
    if (hasil.rows.length === 0) return res.status(404).json({ message: 'Destinasi tidak ditemukan.' });
    res.json(hasil.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal mengubah destinasi.' });
  }
});

// DELETE /api/destinasi/:id  (admin)
router.delete('/:id', hanyaAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM destinasi WHERE id_destinasi = $1', [req.params.id]);
    res.json({ message: 'Destinasi dihapus.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Gagal menghapus destinasi.' });
  }
});

module.exports = router;
