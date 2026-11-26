const Product = require('../models/productModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.getAll = async (req, res) => {
  const { category, brand, stockStatus, minPrice, maxPrice, minRating, search, isFeatured, sort } = req.query;
  const filter = {};

  if (category && category !== 'Semua Kategori') {
    filter.category = category;
  }

  if (brand) {
    const brands = Array.isArray(brand) ? brand : brand.split(',');
    filter.brand = { $in: brands };
  }

  if (stockStatus) {
    filter.stockStatus = stockStatus;
  }

  if (minPrice || maxPrice) {
    filter.itemPrice = {};
    if (minPrice) filter.itemPrice.$gte = Number(minPrice);
    if (maxPrice) filter.itemPrice.$lte = Number(maxPrice);
  }

  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured === 'true';
  }

  if (search) {
    filter.$or = [
      { productTitle: { $regex: search, $options: 'i' } },
      { productDescription: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  let sortOption = { isFeatured: -1, createdAt: -1 };
  if (sort === 'price-asc') sortOption = { itemPrice: 1 };
  if (sort === 'price-desc') sortOption = { itemPrice: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'name') sortOption = { productTitle: 1 };

  const products = await Product.find(filter).sort(sortOption);
  res.json(products);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  // Cari berdasarkan custom id (e.g., P001), atau _id MongoDB
  const product = await Product.findOne({
    $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!product) throw errorHttp(404, 'Produk tidak ditemukan');
  res.json(product);
};

exports.create = async (req, res) => {
  const data = req.body;
  if (!data.id && data.sku) {
    data.id = data.sku;
  }
  if (req.user && req.user.id) {
    data.sellerId = req.user.id;
  }

  const product = await Product.create(data);
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate(
    { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
    req.body,
    { returnDocument: 'after', runValidators: true }
  );

  if (!product) throw errorHttp(404, 'Produk tidak ditemukan');
  res.json(product);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({
    $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!product) throw errorHttp(404, 'Produk tidak ditemukan');
  res.json({ message: 'Produk berhasil dihapus', id: product.id || product._id });
};
