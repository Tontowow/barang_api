// Mengimpor library yang dibutuhkan
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models'); // Mengimpor model User dari Sequelize

// Inisialisasi Google Auth Client dengan Client ID dari file .env
// PENTING: GOOGLE_CLIENT_ID ini adalah Client ID untuk "Web application"
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  /**
   * Fungsi untuk menangani login dari aplikasi mobile.
   * Menerima idToken dari Google Sign-In, memverifikasinya, dan mengembalikan
   * token JWT internal milik aplikasi kita.
   */
  appLogin: async (req, res) => {
    // Mengambil idToken dari body request yang dikirim oleh Android
    const { token } = req.body;
    try {
      // 1. Memverifikasi idToken yang diterima ke server Google
      const ticket = await client.verifyIdToken({
        idToken: token,
        // Audience harus cocok dengan Client ID server kita untuk memastikan
        // token ini memang ditujukan untuk backend kita.
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      // 2. Jika verifikasi berhasil, ambil data pengguna (payload) dari tiket
      const payload = ticket.getPayload();
      const { sub, email, name } = payload; // 'sub' adalah ID unik Google untuk pengguna ini

      // 3. Cari pengguna di database berdasarkan googleId, atau buat baru jika tidak ada
      const [user, created] = await User.findOrCreate({
        where: { googleId: sub },
        defaults: {
          email: email,
          displayName: name,
        },
      });

      // 4. Buat token JWT internal aplikasi kita
      // Token ini berisi informasi yang aman untuk identifikasi (bukan data sensitif)
      const jwtToken = jwt.sign(
        { id: user.id, email: user.email }, // Payload untuk JWT
        process.env.JWT_SECRET,             // Kunci rahasia dari .env
        { expiresIn: '1d' }                 // Token akan kedaluwarsa dalam 1 hari
      );

      // 5. Kirim respons sukses ke aplikasi Android
      res.status(200).json({
        message: 'Login berhasil',
        user: user,       // Kirim data user yang lengkap
        token: jwtToken,  // Kirim token JWT untuk disimpan di Android
      });

    } catch (error) {
      // Jika terjadi error (misalnya token tidak valid), kirim respons error
      console.error('API Login Error:', error);
      res.status(401).json({ message: 'Login gagal. Token tidak valid.'});
    }
  },

  /**
   * Fungsi untuk logout. Dalam sistem JWT yang stateless,
   * server tidak perlu melakukan apa-apa. Proses logout sebenarnya
   * adalah client menghapus token yang disimpannya.
   */
  logout: (req, res) => {
    res.status(200).json({ message: 'Logout berhasil di sisi server.' });
  },
};