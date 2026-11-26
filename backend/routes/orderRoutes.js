const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/verifyToken');
const hanyaRole = require('../middlewares/hanyaRole');

// Pembeli membuat pesanan, semua role terotentikasi bisa melihat
router.get('/', verifyToken, orderController.getAll);
router.get('/:id', verifyToken, orderController.getById);
router.post('/', verifyToken, orderController.create);

// Update status pesanan (penjual / admin)
router.put('/:id/status', verifyToken, hanyaRole('penjual', 'admin'), orderController.updateStatus);

module.exports = router;
