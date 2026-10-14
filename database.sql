-- ============================================================
-- Medan Explore - struktur database sesuai dokumen
-- Jalankan di Supabase > SQL Editor (cukup SEKALI)
-- PERHATIAN: tabel lama (users, messages, destinations) dihapus dulu.
-- ============================================================
DROP TABLE IF EXISTS pertanyaan, review, gallery, destinasi, kategori, messages, destinations, users CASCADE;

CREATE TABLE users (
  id_user SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'pengunjung' CHECK (role IN ('admin', 'pengunjung')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE kategori (
  id_kategori SERIAL PRIMARY KEY,
  nama_kategori VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE destinasi (
  id_destinasi SERIAL PRIMARY KEY,
  nama_destinasi VARCHAR(150) NOT NULL,
  lokasi VARCHAR(150),
  deskripsi TEXT,
  detail_deskripsi TEXT,
  gambar TEXT,
  sumber_gambar VARCHAR(150),
  jam_buka VARCHAR(50),
  harga_tiket INTEGER DEFAULT 0,
  alamat TEXT,
  maps TEXT,
  is_top BOOLEAN DEFAULT FALSE,
  jumlah_dilihat INTEGER DEFAULT 0,
  id_kategori INTEGER REFERENCES kategori(id_kategori),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE gallery (
  id_gallery SERIAL PRIMARY KEY,
  judul VARCHAR(150) NOT NULL,
  gambar TEXT NOT NULL,
  id_destinasi INTEGER REFERENCES destinasi(id_destinasi) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE review (
  id_review SERIAL PRIMARY KEY,
  id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
  id_destinasi INTEGER NOT NULL REFERENCES destinasi(id_destinasi) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  komentar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (id_user, id_destinasi)
);

CREATE TABLE pertanyaan (
  id_pertanyaan SERIAL PRIMARY KEY,
  id_destinasi INTEGER REFERENCES destinasi(id_destinasi) ON DELETE SET NULL,
  id_user INTEGER REFERENCES users(id_user) ON DELETE SET NULL,
  nama_pengirim VARCHAR(100) NOT NULL,
  pesan TEXT NOT NULL,
  balasan TEXT,
  status VARCHAR(10) NOT NULL DEFAULT 'Baru' CHECK (status IN ('Baru', 'Dibaca', 'Dibalas')),
  tanggal_kirim TIMESTAMP DEFAULT NOW(),
  tanggal_dibalas TIMESTAMP
);

INSERT INTO kategori (nama_kategori) VALUES ('Wisata Sejarah'), ('Alam'), ('Rekreasi'), ('Kuliner');

INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Istana Maimun', 'Medan Maimun, Medan', 'Istana Kesultanan Deli yang menjadi salah satu ikon bersejarah Kota Medan.', 'Istana Maimun adalah istana bersejarah yang dibangun pada tahun 1888 oleh Sultan Deli, Sultan Ma''mun Al Rashid Perkasa Alamsyah. Istana ini menggabungkan arsitektur Melayu, Islam, Spanyol, India, dan Italia. Dengan warna kuning yang mencolok, Istana Maimun menjadi simbol kebanggaan Kota Medan dan merupakan salah satu destinasi wisata sejarah yang populer di Sumatera Utara.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Istana%20Maimun%2C%20Medan.jpg', 'Anton Leddin / Wikimedia Commons', '08.00 - 17.00 WIB', 10000, 'Jl. Brigjend Katamso No.66, Medan Maimun, Medan', 'https://maps.app.goo.gl/EX6SW93S7VQ2diaZ8', true, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Wisata Sejarah'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Tjong A Fie Mansion', 'Kesawan, Medan', 'Rumah bersejarah Tjong A Fie dengan arsitektur dan kisah budaya yang menarik.', 'Tjong A Fie Mansion adalah rumah bersejarah yang dibangun oleh Tjong A Fie, seorang pengusaha sukses keturunan Tionghoa di Medan pada awal abad ke-20. Rumah ini menampilkan arsitektur unik yang menggabungkan gaya Tionghoa, Eropa, dan Melayu. Selain sebagai tempat tinggal, mansion ini juga menjadi pusat kegiatan sosial dan bisnis pada masanya. Saat ini, Tjong A Fie Mansion menjadi destinasi wisata sejarah yang menarik bagi pengunjung yang ingin mengetahui lebih dalam tentang sejarah dan budaya Medan.', 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Skewed_Front_View%2C_Tjong_A_Fie_Mansion%2C_Medan.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original', 'Herusutimbul / Wikimedia Commons', '09.00 - 16.00 WIB', 15000, 'Jl. Kebon Sirih No.12, Kesawan, Medan', 'https://maps.app.goo.gl/2m3jMTudvdSSmZAD9', true, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Wisata Sejarah'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Masjid Raya Al-Mashun', 'Medan Kota, Medan', 'Masjid bersejarah peninggalan Kesultanan Deli dengan arsitektur yang khas.', 'Masjid Raya Al-Mashun, juga dikenal sebagai Masjid Raya Medan, adalah masjid bersejarah yang dibangun pada tahun 1906 oleh Sultan Ma''mun Al Rashid Perkasa Alamsyah dari Kesultanan Deli. Masjid ini menampilkan arsitektur yang menggabungkan gaya Timur Tengah, India, dan Spanyol. Dengan kubah besar dan menara yang menjulang, masjid ini menjadi salah satu ikon keagamaan dan budaya di Kota Medan. Selain sebagai tempat ibadah, Masjid Raya Al-Mashun juga menjadi destinasi wisata sejarah yang menarik bagi pengunjung yang ingin mengeksplorasi warisan budaya Islam di Sumatera Utara.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Masjid%20Raya%20Al-Mashun%20Medan.jpg', 'Herusutimbul / Wikimedia Commons', '05.00 - 20.00 WIB', 0, 'Jl. Sisingamangaraja No.1, Medan Kota, Medan', 'https://maps.app.goo.gl/npXDwVrSVFWd92m4A', false, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Wisata Sejarah'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Air Terjun Sipiso-piso', 'Karo, Sumatera Utara', 'Air terjun tinggi dengan panorama alam pegunungan yang sangat indah.', 'Air Terjun Sipiso-piso adalah salah satu air terjun tertinggi di Indonesia, dengan ketinggian sekitar 120 meter. Terletak di Kabupaten Karo, Sumatera Utara, air terjun ini menawarkan pemandangan alam yang menakjubkan, termasuk tebing curam dan lembah yang hijau. Nama ''Sipiso-piso'' berasal dari bahasa Batak yang berarti ''pisau'', menggambarkan bentuk air terjun yang seperti pisau yang jatuh dari tebing. Selain keindahan alamnya, lokasi ini juga menjadi tempat populer untuk fotografi dan wisata alam bagi pengunjung yang ingin menikmati udara segar pegunungan.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sipiso-piso%20Waterfalls.jpg', 'Wikimedia Commons', '08.00 - 17.00 WIB', 5000, 'Kec. Merek, Kab. Karo, Sumatera Utara', 'https://maps.app.goo.gl/4WPB6kZykhFVd5SP7', true, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Alam'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Danau Toba', 'Sumatera Utara', 'Danau vulkanik luas dengan panorama pegunungan dan budaya Batak.', 'Danau Toba adalah danau vulkanik terbesar di Indonesia dan salah satu yang terbesar di dunia, terletak di Provinsi Sumatera Utara. Danau ini terbentuk dari letusan gunung berapi purba dan memiliki panjang sekitar 100 km dan lebar 30 km. Di tengah danau terdapat Pulau Samosir, yang merupakan pusat budaya Batak. Danau Toba menawarkan pemandangan alam yang menakjubkan, termasuk pegunungan hijau, air jernih, dan udara segar. Selain keindahan alamnya, Danau Toba juga menjadi destinasi wisata populer untuk kegiatan seperti berenang, berperahu, dan menjelajahi budaya lokal.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Danau%20toba.png', 'Zaenulihsan91 / Wikimedia Commons', '06.00 - 18.00 WIB', 3000, 'Kab. Tapanuli Utara, Sumatera Utara', 'https://maps.app.goo.gl/Xep6ApAT3yXGwGxC6', true, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Alam'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Taman Cadika', 'Medan Johor, Medan', 'Ruang terbuka hijau yang cocok untuk bersantai, olahraga, dan menikmati alam.', 'Taman Cadika adalah taman kota yang terletak di Medan Johor, Medan. Taman ini menyediakan ruang terbuka hijau yang luas, cocok untuk berbagai kegiatan rekreasi seperti berjalan-jalan, berolahraga, atau sekadar bersantai menikmati udara segar. Dengan pepohonan rindang dan area bermain anak-anak, Taman Cadika menjadi tempat favorit bagi warga lokal dan wisatawan untuk melepas penat dari kesibukan kota. Selain itu, taman ini juga sering digunakan untuk acara komunitas dan kegiatan sosial.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Taman%20Cadika%20Medan%20Johor.jpg', 'Wikimedia Commons', '07.00 - 19.00 WIB', 0, 'Jl. Sisingamangaraja No.1, Medan Kota, Medan', 'https://maps.app.goo.gl/nV2cRHRtGzeijy8P6', false, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Rekreasi'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Lapangan Merdeka', 'Kesawan, Medan', 'Ruang publik bersejarah di pusat Kota Medan yang sering digunakan untuk kegiatan warga.', 'Lapangan Merdeka adalah sebuah ruang publik yang terletak di pusat Kota Medan, Sumatera Utara. Lapangan ini memiliki nilai sejarah yang tinggi karena menjadi saksi berbagai peristiwa penting dalam sejarah kota. Selain itu, Lapangan Merdeka juga menjadi tempat favorit bagi warga lokal untuk berolahraga, bersantai, dan mengadakan berbagai kegiatan komunitas. Dengan pemandangan yang indah dan udara yang sejuk, lapangan ini menjadi salah satu destinasi rekreasi yang populer di Medan.', 'https://assetd.kompas.id/E_e96XvtE3W5TNDqaYS4jnSiDzg=/480x480/smart/filters:format(webp):quality(80)/https://asset.kgnewsroom.com/photo/pre/2025/02/19/cdef6dc5-3e22-4694-835e-a2d3fa9ea2fc_jpg.jpg', 'Fadhil Dimas Nabillah / Wikimedia Commons', '06.00 - 20.00 WIB', 0, 'Jl. Merdeka No.1, Kesawan, Medan', 'https://maps.app.goo.gl/cNVuxneuwKgJ8ecbA', true, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Rekreasi'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Soto Medan', 'Kota Medan', 'Kuliner khas Medan dengan kuah santan yang gurih dan kaya rempah.', 'Soto Medan adalah salah satu kuliner khas Kota Medan yang terkenal dengan kuah santannya yang gurih dan kaya rempah. Hidangan ini biasanya disajikan dengan potongan daging ayam atau sapi, bihun, tauge, dan taburan bawang goreng. Soto Medan memiliki cita rasa yang unik dan menjadi favorit bagi warga lokal maupun wisatawan yang berkunjung ke Medan. Selain rasanya yang lezat, Soto Medan juga dikenal sebagai makanan yang menghangatkan tubuh, terutama saat cuaca dingin.', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Soto%20medan.jpg', 'Fachriazmi9 / Wikimedia Commons', '07.00 - 21.00 WIB', 15000, '', '', false, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Kuliner'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Bika Ambon', 'Kota Medan', 'Kue khas Medan dengan tekstur berserat dan rasa manis yang khas.', 'Bika Ambon adalah kue tradisional khas Kota Medan yang terkenal dengan teksturnya yang berserat dan rasa manis yang khas. Kue ini terbuat dari campuran tepung tapioka, santan, gula, dan ragi, yang kemudian dipanggang hingga menghasilkan tekstur yang kenyal dan berongga. Bika Ambon biasanya disajikan dalam potongan kecil dan memiliki aroma pandan yang harum. Kue ini menjadi oleh-oleh favorit bagi wisatawan yang berkunjung ke Medan dan merupakan bagian dari kekayaan kuliner Indonesia.', 'https://pesonanusantara.co.id/images/upload//b/o/bolumerantiwdd_02produk_variasi_04bikambon.jpg', 'Taman Renyah / Wikimedia Commons', '08.00 - 20.00 WIB', 10000, '', '', false, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Kuliner'));
INSERT INTO destinasi (nama_destinasi, lokasi, deskripsi, detail_deskripsi, gambar, sumber_gambar, jam_buka, harga_tiket, alamat, maps, is_top, id_kategori) VALUES ('Kuil Shri Mariamman', 'Kampung Madras, Medan', 'Kuil Hindu bersejarah yang menjadi bagian dari keragaman budaya Kota Medan.', 'Kuil Shri Mariamman adalah sebuah kuil Hindu bersejarah yang terletak di Kampung Madras, Medan. Kuil ini memiliki arsitektur yang unik dan merupakan bagian dari keragaman budaya Kota Medan. Kuil ini menjadi tempat ibadah bagi umat Hindu di wilayah tersebut dan juga menjadi destinasi wisata yang menarik bagi para pengunjung yang ingin mengetahui lebih banyak tentang budaya dan agama di Medan.', 'https://awsimages.detik.net.id/community/media/visual/2023/10/04/gerbang-kuil-shri-mariamman-di-medan-farid-achyadi-siregardetiksumut-1_169.jpeg?w=620', 'Wikimedia Commons', '08.00 - 17.00 WIB', 5000, 'Kampung Madras, Medan', 'https://maps.app.goo.gl/mJDg5ajo2pDym6wr6', false, (SELECT id_kategori FROM kategori WHERE nama_kategori = 'Wisata Sejarah'));

INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Istana Maimun', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Istana%20Maimun%2C%20Medan.jpg', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Istana Maimun'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Tjong A Fie Mansion', 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Skewed_Front_View%2C_Tjong_A_Fie_Mansion%2C_Medan.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Tjong A Fie Mansion'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Masjid Raya Al-Mashun', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Masjid%20Raya%20Al-Mashun%20Medan.jpg', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Masjid Raya Al-Mashun'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Air Terjun Sipiso-piso', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sipiso-piso%20Waterfalls.jpg', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Air Terjun Sipiso-piso'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Danau Toba', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Danau%20toba.png', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Danau Toba'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Taman Cadika', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Taman%20Cadika%20Medan%20Johor.jpg', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Taman Cadika'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Lapangan Merdeka', 'https://assetd.kompas.id/E_e96XvtE3W5TNDqaYS4jnSiDzg=/480x480/smart/filters:format(webp):quality(80)/https://asset.kgnewsroom.com/photo/pre/2025/02/19/cdef6dc5-3e22-4694-835e-a2d3fa9ea2fc_jpg.jpg', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Lapangan Merdeka'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Soto Medan', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Soto%20medan.jpg', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Soto Medan'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Bika Ambon', 'https://pesonanusantara.co.id/images/upload//b/o/bolumerantiwdd_02produk_variasi_04bikambon.jpg', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Bika Ambon'));
INSERT INTO gallery (judul, gambar, id_destinasi) VALUES ('Kuil Shri Mariamman', 'https://awsimages.detik.net.id/community/media/visual/2023/10/04/gerbang-kuil-shri-mariamman-di-medan-farid-achyadi-siregardetiksumut-1_169.jpeg?w=620', (SELECT id_destinasi FROM destinasi WHERE nama_destinasi = 'Kuil Shri Mariamman'));
