const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/verifyToken');
const hanyaRole = require('../middlewares/hanyaRole');

// Semua rute admin diproteksi token & role admin
router.get('/stats', verifyToken, hanyaRole('admin'), adminController.getStats);
router.get('/complaints', verifyToken, hanyaRole('admin'), adminController.getComplaints);
router.post('/complaints', adminController.createComplaint); // bisa dibuat publik/user
router.put('/complaints/:id/resolve', verifyToken, hanyaRole('admin'), adminController.resolveComplaint);
router.get('/sellers', verifyToken, hanyaRole('admin'), adminController.getSellers);

module.exports = router;
