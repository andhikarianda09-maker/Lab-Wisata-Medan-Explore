// Pemeriksa token login (JWT)
const jwt = require('jsonwebtoken');

function bacaToken(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// login boleh ada, boleh tidak
function loginOpsional(req, res, next) {
  req.user = bacaToken(req);
  next();
}

// wajib login
function harusLogin(req, res, next) {
  const user = bacaToken(req);
  if (!user) return res.status(401).json({ message: 'Silakan login dulu.' });
  req.user = user;
  next();
}

// wajib login sebagai admin
function hanyaAdmin(req, res, next) {
  const user = bacaToken(req);
  if (!user) return res.status(401).json({ message: 'Silakan login dulu.' });
  if (user.role !== 'admin') return res.status(403).json({ message: 'Halaman ini khusus admin.' });
  req.user = user;
  next();
}

module.exports = { loginOpsional, harusLogin, hanyaAdmin };