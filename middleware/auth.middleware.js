// middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

module.exports = {
  /**
   * Middleware untuk memeriksa apakah user sudah login dengan token JWT yang valid.
   */
  isLoggedIn: (req, res, next) => {
    // 1. Ambil header 'authorization'. Formatnya: "Bearer <TOKEN>"
    const authHeader = req.headers['authorization'];
    
    // 2. Ekstrak token dari header. Jika header tidak ada, token akan null.
    const token = authHeader && authHeader.split(' ')[1];

    // 3. Jika tidak ada token, kirim error 401 (Unauthorized)
    if (token == null) {
      return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
    }

    // 4. Verifikasi token menggunakan secret key dari .env
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      // Jika token tidak valid atau kedaluwarsa, kirim error 403 (Forbidden)
      if (err) {
        return res.status(403).json({ message: 'Akses ditolak. Token tidak valid.' });
      }
      
      // 5. Jika token valid, simpan informasi user ke dalam object request
      //    agar bisa digunakan oleh endpoint selanjutnya.
      req.user = user;
      
      // 6. Lanjutkan ke proses selanjutnya (endpoint barang)
      next();
    });
  },
};