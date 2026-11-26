const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'sku wajib diisi'],
    unique: true,
    trim: true,
  },
  productTitle: {
    type: String,
    required: [true, 'productTitle wajib diisi'],
    trim: true,
  },
  productDescription: {
    type: String,
    required: [true, 'productDescription wajib diisi'],
  },
  itemPrice: {
    type: Number,
    required: [true, 'itemPrice wajib diisi'],
    min: [0, 'itemPrice tidak boleh negatif'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'originalPrice tidak boleh negatif'],
  },
  category: {
    type: String,
    required: [true, 'category wajib diisi'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'brand wajib diisi'],
    trim: true,
  },
  stockStatus: {
    type: String,
    enum: {
      values: ['in_stock', 'low_stock', 'out_of_stock'],
      message: "stockStatus harus 'in_stock', 'low_stock', atau 'out_of_stock'",
    },
    default: 'in_stock',
  },
  stockQuantity: {
    type: Number,
    required: [true, 'stockQuantity wajib diisi'],
    default: 0,
    min: [0, 'stockQuantity tidak boleh negatif'],
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=700&h=480&fit=crop&auto=format',
  },
  specs: {
    type: Map,
    of: String,
    default: {},
  },
  tags: {
    type: [String],
    default: [],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware sebelum simpan: jika id belum ada, isi dengan sku atau format PXXX
productSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this.sku;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
