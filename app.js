require('dotenv').config();
require('./config/passport'); // Inisialisasi konfigurasi passport

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth.routes');
const barangRoutes = require('./routes/barang.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // set to true on production (https)
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder untuk serve gambar yang di-upload
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
  res.send('Selamat Datang di API Barang!');
});
app.use('/auth', authRoutes);
app.use('/barang', barangRoutes);


// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});