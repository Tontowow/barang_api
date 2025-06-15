const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// Inisiasi login dengan Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback setelah login dari Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  authController.googleCallback
);
// ROUTE BARU UNTUK LOGIN ANDROID
router.post('/google/app-login', authController.appLogin);

// Logout
router.get('/logout', authController.logout);

// Cek status login
router.get('/status', authController.status);


module.exports = router;