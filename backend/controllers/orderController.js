const Order = require('../models/orderModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.getAll = async (req, res) => {
  const filter = {};
  // Jika pembeli biasa mengakses, hanya lihat pesanannya sendiri
  if (req.user && req.user.role === 'pembeli') {
    filter.userId = req.user.id;
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({
    $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!order) throw errorHttp(404, 'Pesanan tidak ditemukan');
  res.json(order);
};

exports.create = async (req, res) => {
  const data = req.body;

  if (!data.orderId) {
    data.orderId = `AGF-2024-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  }
  if (!data.orderDate) {
    data.orderDate = new Date().toISOString().split('T')[0];
  }
  if (!data.estimatedDelivery) {
    data.estimatedDelivery = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  if (!data.trackingNumber) {
    data.trackingNumber = `UPS${Math.random().toString(36).substring(2, 16).toUpperCase()}`;
  }
  if (req.user && req.user.id) {
    data.userId = req.user.id;
  }

  const order = await Order.create(data);
  res.status(201).json(order);
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'].includes(orderStatus)) {
    throw errorHttp(400, 'Status pesanan tidak valid');
  }

  const order = await Order.findOneAndUpdate(
    { $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
    { orderStatus },
    { returnDocument: 'after' }
  );

  if (!order) throw errorHttp(404, 'Pesanan tidak ditemukan');
  res.json(order);
};
