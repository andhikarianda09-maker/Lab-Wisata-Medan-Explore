// Membuat (atau menjadikan) akun admin.
// Cara pakai:  node buatAdmin.js "Nama Admin" email@contoh.com passwordnya
const bcrypt = require('bcrypt');
const db = require('./db');

async function main() {
  const [nama, email, password] = process.argv.slice(2);

  if (!nama || !email || !password) {
    console.log('Cara pakai: node buatAdmin.js "Nama Admin" email@contoh.com password');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // kalau email sudah ada -> jadikan admin, kalau belum -> buat akun baru
  await db.query(
    `INSERT INTO users (nama, email, password, role) VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE SET role = 'admin', password = $3`,
    [nama, email, passwordHash]
  );

  console.log('Akun admin siap: ' + email);
  process.exit(0);
}

main().catch(err => {
  console.log(err);
  process.exit(1);
});