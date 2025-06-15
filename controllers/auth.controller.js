// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  // ... (fungsi googleCallback yang lama bisa dibiarkan atau dihapus)

  // FUNGSI BARU UNTUK LOGIN DARI ANDROID
  appLogin: async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { sub, email, name } = payload;

      const [user, created] = await User.findOrCreate({
        where: { googleId: sub },
        defaults: {
          email: email,
          displayName: name,
        },
      });

      // Buat JWT Token untuk dikirim ke client
      const jwtToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token berlaku 1 hari
      );

      res.status(200).json({
        message: 'Login successful',
        user: user,
        token: jwtToken, // Kirim token ke Android
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(401).json({ message: 'Login failed. Invalid token.', error: error.message });
    }
  },

  logout: (req, res) => {
    // Logout di sisi client (hapus token), di server tidak perlu state
    res.status(200).json({ message: 'Logout successful on server.' });
  },

  // ... (fungsi status yang lama)
};

module.exports = {
  googleCallback: (req, res) => {
    // Redirect atau kirim token di sini. Untuk API, kita bisa kirim pesan sukses.
    res.status(200).json({ message: 'Successfully logged in', user: req.user });
  },

  logout: (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy();
      res.status(200).json({ message: 'Successfully logged out.' });
    });
  },

  status: (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ loggedIn: true, user: req.user });
    } else {
      res.status(200).json({ loggedIn: false });
    }
  }
};