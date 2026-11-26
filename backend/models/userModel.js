const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name wajib diisi'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'email wajib diisi'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
  },
  password: {
    type: String,
    required: [true, 'password wajib diisi'],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ['pembeli', 'penjual', 'admin'],
      message: "role hanya boleh 'pembeli', 'penjual', atau 'admin'",
    },
    default: 'pembeli',
  },
  farmName: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
