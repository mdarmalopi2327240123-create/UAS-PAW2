const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    id: String,
    productTitle: String,
    itemPrice: Number,
    imageUrl: String,
    category: String,
    brand: String,
    sku: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  phone: { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderDate: {
    type: String,
    required: true,
  },
  items: {
    type: [cartItemSchema],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'],
    default: 'processing',
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true,
  },
  estimatedDelivery: {
    type: String,
    required: true,
  },
  trackingNumber: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
