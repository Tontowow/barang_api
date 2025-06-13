const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barang.controller');
const upload = require('../middleware/upload');
const { isLoggedIn } = require('../middleware/auth.middleware');

// Semua rute barang dilindungi, harus login dulu
router.use(isLoggedIn);

router.post('/', upload, barangController.create);
router.get('/', barangController.findAll);
router.get('/:id', barangController.findOne);
router.put('/:id', upload, barangController.update);
router.delete('/:id', barangController.delete);

module.exports = router;