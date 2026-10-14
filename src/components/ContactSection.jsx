import { useState } from 'react';
import { api } from '../api.js';

export default function ContactSection({ user, destinasi }) {
  const [nama, setNama] = useState(user ? user.nama : '');
  const [pesan, setPesan] = useState('');
  const [idDestinasi, setIdDestinasi] = useState('');
  const [errNama, setErrNama] = useState('');
  const [errPesan, setErrPesan] = useState('');
  const [sukses, setSukses] = useState('');

  async function kirim(event) {
    event.preventDefault();
    setErrNama('');
    setErrPesan('');
    setSukses('');

    let valid = true;
    if (nama.trim() === '') {
      setErrNama('Nama wajib diisi.');
      valid = false;
    }
    if (pesan.trim() === '') {
      setErrPesan('Pesan wajib diisi.');
      valid = false;
    }
    if (!valid) return;

    try {
      await api('/pertanyaan', 'POST', {
        nama_pengirim: nama,
        pesan: pesan,
        id_destinasi: idDestinasi || null
      });
      setSukses('Pesan berhasil dikirim. Terima kasih!');
      setPesan('');
      setIdDestinasi('');
    } catch (err) {
      setErrPesan(err.message);
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-intro">
        <p className="eyebrow">Butuh Informasi?</p>
        <h2>Tanya Tentang Destinasi</h2>
        <p>Punya pertanyaan seputar destinasi wisata di Medan? Isi form di samping.</p>
      </div>

      <form className="contact-form" onSubmit={kirim} noValidate>
        <div>
          <label htmlFor="name">Nama *</label>
          <input
            id="name"
            type="text"
            placeholder="Masukkan nama Anda"
            value={nama}
            onChange={e => setNama(e.target.value)}
          />
          <small>{errNama}</small>
        </div>

        <div>
          <label htmlFor="message">Pesan *</label>
          <textarea
            id="message"
            rows="5"
            placeholder="Tulis pesan Anda..."
            value={pesan}
            onChange={e => setPesan(e.target.value)}
          />
          <small>{errPesan}</small>
        </div>

        <div>
          <label htmlFor="tujuan">Destinasi (opsional)</label>
          <select id="tujuan" value={idDestinasi} onChange={e => setIdDestinasi(e.target.value)}>
            <option value="">Pertanyaan umum</option>
            {destinasi.map(d => (
              <option key={d.id_destinasi} value={d.id_destinasi}>{d.nama_destinasi}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-kirim">Kirim Pesan</button>
        <p className="success">{sukses}</p>
      </form>
    </section>
  );
}
