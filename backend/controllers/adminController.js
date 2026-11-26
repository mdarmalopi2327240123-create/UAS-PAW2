const Complaint = require('../models/complaintModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const { errorHttp } = require('../middlewares/errorHandler');

// Dashboard Stats
exports.getStats = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalComplaints = await Complaint.countDocuments({ status: { $ne: 'resolved' } });

  res.json({
    cpu: '42%',
    memory: '2.6GB / 8GB',
    uptime: '99.9%',
    activeUsers: totalUsers,
    totalProducts,
    totalOrders,
    pendingComplaints: totalComplaints,
  });
};

// Complaints
exports.getComplaints = async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints);
};

exports.createComplaint = async (req, res) => {
  const { user, issue } = req.body;
  if (!user || !issue) throw errorHttp(400, 'user dan issue wajib diisi');

  const complaintId = `C-${String(Math.floor(Math.random() * 900) + 100)}`;
  const date = new Date().toISOString().split('T')[0];

  const complaint = await Complaint.create({
    complaintId,
    user,
    issue,
    date,
    status: 'pending',
  });

  res.status(201).json(complaint);
};

exports.resolveComplaint = async (req, res) => {
  const { id } = req.params;
  const complaint = await Complaint.findOneAndUpdate(
    { $or: [{ complaintId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
    { status: 'resolved' },
    { returnDocument: 'after' }
  );

  if (!complaint) throw errorHttp(404, 'Komplain tidak ditemukan');
  res.json(complaint);
};

// Sellers management
exports.getSellers = async (req, res) => {
  const sellers = await User.find({ role: 'penjual' });
  const sellerList = sellers.map((s, index) => ({
    id: `S-${String(index + 1).padStart(3, '0')}`,
    _id: s._id,
    name: s.farmName || s.name,
    email: s.email,
    rating: 4.8,
    active: true,
    complaints: 0,
  }));
  res.json(sellerList);
};
