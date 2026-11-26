const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');
const hanyaRole = require('../middlewares/hanyaRole');

// Publik bisa melihat daftar & detail produk
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Penjual & Admin bisa mengelola produk
router.post('/', verifyToken, hanyaRole('penjual', 'admin'), productController.create);
router.put('/:id', verifyToken, hanyaRole('penjual', 'admin'), productController.update);
router.delete('/:id', verifyToken, hanyaRole('penjual', 'admin'), productController.remove);

module.exports = router;
