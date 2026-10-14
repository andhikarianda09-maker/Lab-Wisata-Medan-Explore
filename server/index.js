// Server utama Medan Explore
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Route API
app.use('/api', require('./routes/auth'));
app.use('/api/kategori', require('./routes/kategori'));
app.use('/api/destinasi', require('./routes/destinasi'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/review', require('./routes/review'));
app.use('/api/pertanyaan', require('./routes/pertanyaan'));

// Menampilkan website hasil "npm run build" (dipakai saat online)
const dist = path.join(__dirname, '../dist');
app.use(express.static(dist));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  res.sendFile(path.join(dist, 'index.html'), err => {
    if (err) next();
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server jalan di http://localhost:' + PORT);
});