const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { errorHttp } = require('../middlewares/errorHandler');

const SALT_ROUNDS = 10;
const PASSWORD_MIN = 8;
const PASSWORD_MAKS_BYTE = 72;

exports.register = async (req, res) => {
  const { name, email, password, role, farmName } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    throw errorHttp(400, 'name wajib diisi');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw errorHttp(400, 'email wajib diisi dengan format email valid');
  }

  if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
    throw errorHttp(400, `password wajib diisi, minimal ${PASSWORD_MIN} karakter`);
  }

  if (Buffer.byteLength(password) > PASSWORD_MAKS_BYTE) {
    throw errorHttp(400, `password maksimal ${PASSWORD_MAKS_BYTE} byte`);
  }

  const existing = await User.findOne({ email: email.trim().toLowerCase() });
  if (existing) {
    throw errorHttp(409, 'Email sudah terdaftar');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const userRole = role && ['pembeli', 'penjual', 'admin'].includes(role) ? role : 'pembeli';

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: userRole,
    farmName: farmName ? farmName.trim() : undefined,
  });

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  res.status(201).json({
    status: 'success',
    message: 'Registrasi berhasil',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      farmName: user.farmName,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw errorHttp(400, 'email dan password wajib diisi');
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  const match = user ? await bcrypt.compare(password, user.password) : false;

  if (!match) {
    throw errorHttp(401, 'Email atau password salah');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  res.json({
    status: 'success',
    message: 'Login berhasil',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      farmName: user.farmName,
    },
  });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw errorHttp(404, 'User tidak ditemukan');

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    farmName: user.farmName,
    berlakuSampai: new Date(req.user.exp * 1000),
  });
};
