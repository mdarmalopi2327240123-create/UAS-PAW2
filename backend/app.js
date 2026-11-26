require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET belum diisi di .env');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware global ----------
app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Express 5: req.body bernilai undefined bila request tidak membawa body JSON
app.use((req, res, next) => {
  req.body ??= {};
  next();
});

// ---------- Route dasar ----------
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'AgroForge RESTful API Server berjalan lancar!',
    developer: 'Darma Lopi',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      products: '/products',
      orders: '/orders',
      admin: '/admin',
    },
  });
});

// ---------- Route per modul ----------
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// ---------- Handler 404 dan error handler ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Koneksi Database dan Jalankan Server ----------
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Terhubung ke MongoDB: ' + process.env.DB_URI);
    app.listen(PORT, () => console.log(`Server AgroForge berjalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal terhubung ke MongoDB:', err.message);
    process.exit(1);
  });
