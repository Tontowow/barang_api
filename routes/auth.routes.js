// routes/auth.routes.js

const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

/**
 * Route untuk login dari aplikasi Android.
 * Method: POST
 * URL: /auth/google/app-login
 * Body: { "token": "idToken_dari_google" }
 * Controller: authController.appLogin
 */
router.post('/google/app-login', authController.appLogin);

/**
 * Route untuk logout. Dalam sistem JWT, ini hanya formalitas di sisi server.
 * Proses logout sebenarnya terjadi di client dengan menghapus token.
 * Method: GET
 * URL: /auth/logout
 */
router.get('/logout', authController.logout);


module.exports = router;