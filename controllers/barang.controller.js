const { Barang } = require('../models');

module.exports = {
  create: async (req, res) => {
    try {
      const { nama, deskripsi } = req.body;
      const gambar = req.file ? `/uploads/${req.file.filename}` : null;

      if (!nama || !deskripsi) {
        return res.status(400).json({ message: 'Nama dan deskripsi harus diisi' });
      }

      const newBarang = await Barang.create({ nama, deskripsi, gambar });
      res.status(201).json({ message: 'Barang berhasil ditambahkan', data: newBarang });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  },

  findAll: async (req, res) => {
    try {
      const barang = await Barang.findAll();
      res.status(200).json({ data: barang });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  },

  findOne: async (req, res) => {
    try {
      const barang = await Barang.findByPk(req.params.id);
      if (!barang) {
        return res.status(404).json({ message: 'Barang tidak ditemukan' });
      }
      res.status(200).json({ data: barang });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { nama, deskripsi } = req.body;
      const barang = await Barang.findByPk(req.params.id);
      if (!barang) {
        return res.status(404).json({ message: 'Barang tidak ditemukan' });
      }

      barang.nama = nama || barang.nama;
      barang.deskripsi = deskripsi || barang.deskripsi;
      
      if (req.file) {
        barang.gambar = `/uploads/${req.file.filename}`;
      }
      
      await barang.save();
      res.status(200).json({ message: 'Barang berhasil diperbarui', data: barang });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const barang = await Barang.findByPk(req.params.id);
      if (!barang) {
        return res.status(404).json({ message: 'Barang tidak ditemukan' });
      }
      await barang.destroy();
      res.status(200).json({ message: 'Barang berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
};