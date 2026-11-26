require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const Complaint = require('./models/complaintModel');

const DEMO_USERS = [
  { name: 'Marcus Tillman', email: 'marcus@tillmanfarm.com', password: 'farm2024', role: 'pembeli', farmName: 'Tillman Farm' },
  { name: 'AgroForge Seller', email: 'seller@agroforge.com', password: 'seller2024', role: 'penjual', farmName: 'AgroForge Central Store' },
  { name: 'Sarah Chen', email: 'admin@agroforge.com', password: 'admin2024', role: 'admin' },
];

const SEED_PRODUCTS = [
  {
    id: 'P001',
    sku: 'JD-6120M-2024',
    productTitle: 'Traktor Utilitas John Deere 6120M',
    productDescription: 'Traktor utilitas 120HP yang bertenaga dengan kabin CommandPod, transmisi PowerReverser 24F/24R, dan kapasitas angkat 5.560 kg. Dirancang untuk operasi skala menengah yang menuntut performa luar biasa dan kenyamanan operator.',
    itemPrice: 87500,
    originalPrice: 92000,
    category: 'Traktor & Mesin',
    brand: 'John Deere',
    stockStatus: 'in_stock',
    stockQuantity: 3,
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=700&h=480&fit=crop&auto=format',
    specs: { Mesin: '120 HP, 4-silinder', Transmisi: '24F/24R PowerReverser', 'Kapasitas Angkat': '5.560 kg', 'Tangki Bahan Bakar': '170L', 'Tenaga PTO': '96.9 HP', 'Jarak Sumbu Roda': '2.515 mm' },
    tags: ['traktor', 'utilitas', 'tugas-berat'],
    isFeatured: true,
  },
  {
    id: 'P002',
    sku: 'CNIH-AF7150-23',
    productTitle: 'Pemanen Case IH Axial-Flow 7150',
    productDescription: 'Mesin pemanen terdepan di industri dengan teknologi rotor Axial-Flow® yang dipatenkan menawarkan kualitas biji-bijian superior, throughput maksimum 354 HP, dan tangki biji-bijian 14.100L untuk operasi panen skala besar.',
    itemPrice: 425000,
    category: 'Peralatan Panen',
    brand: 'Case IH',
    stockStatus: 'low_stock',
    stockQuantity: 1,
    rating: 4.9,
    reviewCount: 87,
    imageUrl: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=700&h=480&fit=crop&auto=format',
    specs: { Mesin: '354 HP, Tier 4B Final', 'Tangki Biji-bijian': '14.100L', 'Laju Bongkar': '113L/detik', Rotor: 'Rotor tunggal Axial-Flow', 'Lebar Header': 'Maks 9,14m', Berat: '18.500 kg' },
    tags: ['combine', 'pemanen', 'komersial'],
    isFeatured: true,
  },
  {
    id: 'P003',
    sku: 'VLLY-CP-130AC',
    productTitle: 'Sistem Irigasi Center Pivot Valley',
    productDescription: 'Center pivot berefisiensi tinggi dengan pemantauan jarak jauh berpemandu GPS melalui Valley ICON, mencakup hingga 130 hektar dengan distribusi air presisi, zonasi VRI, dan penghematan energi terbukti 30% dibandingkan sistem konvensional.',
    itemPrice: 38000,
    originalPrice: 42500,
    category: 'Sistem Irigasi',
    brand: 'Valley Irrigation',
    stockStatus: 'in_stock',
    stockQuantity: 5,
    rating: 4.7,
    reviewCount: 203,
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&h=480&fit=crop&auto=format',
    specs: { Cakupan: 'Hingga 130 hektar', Penggerak: 'Menara bermotor listrik', Kontrol: 'Jarak jauh GPS Valley ICON', 'Diameter Pipa': 'Aluminium 6-inci', VRI: 'Irigasi Laju Variabel', Material: 'Baja galvanis celup panas' },
    tags: ['irigasi', 'pivot', 'manajemen-air'],
    isFeatured: false,
  },
  {
    id: 'P004',
    sku: 'KBT-M7172P-24',
    productTitle: 'Traktor Premium Kubota M7-172',
    productDescription: 'Traktor premium 172HP yang dilengkapi Kubota Variable Transmission (KVT), kabin HVAC penuh bersertifikat ROPS dengan telematika JD-Link, dan kapasitas angkat belakang luar biasa sebesar 9.100 kg untuk operasi lapangan yang paling menuntut.',
    itemPrice: 145000,
    category: 'Traktor & Mesin',
    brand: 'Kubota',
    stockStatus: 'in_stock',
    stockQuantity: 2,
    rating: 4.6,
    reviewCount: 56,
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=700&h=480&fit=crop&auto=format',
    specs: { Mesin: '172 HP, Kubota V6108-CR', Transmisi: 'KVT Stepless CVT', 'Kapasitas Angkat': '9.100 kg', Kabin: 'ROPS, HVAC, kursi bersuspensi udara', Telematika: 'Kubota Remote Connect', 'PTO Depan': 'Tersedia opsi' },
    tags: ['traktor', 'premium', 'cvt'],
    isFeatured: false,
  },
  {
    id: 'P005',
    sku: 'AGCO-GD24R-24',
    productTitle: 'Penebar Biji Presisi 24-Baris AGCO',
    productDescription: 'Penebar biji presisi 24 baris dengan penutup penggerak listrik baris individual, pemantauan SeedStar, dan kompatibilitas hitch 3 titik untuk penempatan benih yang seragam di berbagai jenis tanah dan medan.',
    itemPrice: 18750,
    originalPrice: 21000,
    category: 'Benih & Penanaman',
    brand: 'AGCO',
    stockStatus: 'in_stock',
    stockQuantity: 8,
    rating: 4.5,
    reviewCount: 178,
    imageUrl: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?w=700&h=480&fit=crop&auto=format',
    specs: { Baris: 'Konfigurasi 24-baris', 'Jarak Baris': '19 cm / 7.5 in', 'Tangki Benih': 'Kapasitas 1.200L', Pemantauan: 'Baris individual SeedStar', Hitch: '3-titik Cat. II/III', 'Tekanan Turun': 'Dapat disesuaikan hidrolik' },
    tags: ['penebar-biji', 'biji-bijian', 'presisi'],
    isFeatured: false,
  },
  {
    id: 'P006',
    sku: 'HSQ-572XP-45',
    productTitle: 'Gergaji Mesin Profesional Husqvarna 572 XP',
    productDescription: 'Gergaji mesin tingkat profesional dengan mesin X-TORQ® dengan AutoTune® untuk karburator yang mengoptimalkan diri. Menghadirkan perpindahan 70.6cc dan output 4.0 kW untuk pekerjaan kayu yang berat di segala kondisi.',
    itemPrice: 1299,
    originalPrice: 1450,
    category: 'Perkakas Tangan',
    brand: 'Husqvarna',
    stockStatus: 'in_stock',
    stockQuantity: 15,
    rating: 4.9,
    reviewCount: 312,
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=700&h=480&fit=crop&auto=format',
    specs: { Perpindahan: '70.6 cm³', Tenaga: '4.3 kW / 5.8 HP', 'Panjang Bilah': '50 cm / 20 in', Berat: '6.6 kg (tanpa peralatan potong)', Rantai: '3/8 in pitch, .058 in gauge', Emisi: 'Sesuai EPA/CARB' },
    tags: ['gergaji', 'kehutanan', 'profesional'],
    isFeatured: false,
  },
];

const SEED_COMPLAINTS = [
  { complaintId: 'C-001', user: 'Budi Santoso', issue: 'Barang tidak sesuai deskripsi', status: 'pending', date: '2026-09-23' },
  { complaintId: 'C-002', user: 'Agus Pratama', issue: 'Pengiriman terlambat 5 hari', status: 'resolved', date: '2026-09-22' },
  { complaintId: 'C-003', user: 'Siti Aminah', issue: 'Penjual tidak merespon chat', status: 'investigating', date: '2026-09-24' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Terhubung ke MongoDB untuk Seeding...');

    // 1. Bersihkan koleksi
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Complaint.deleteMany({});

    // 2. Seed Users
    console.log('Menyimpan Demo Users...');
    for (const u of DEMO_USERS) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
    }

    // 3. Seed Products
    console.log('Menyimpan Katalog Produk...');
    await Product.insertMany(SEED_PRODUCTS);

    // 4. Seed Complaints
    console.log('Menyimpan Data Komplain...');
    await Complaint.insertMany(SEED_COMPLAINTS);

    // 5. Seed Initial Orders
    console.log('Menyimpan Demo Pesanan...');
    await Order.create({
      orderId: 'AGF-2024-88421',
      orderDate: '2026-09-18',
      items: [
        { product: SEED_PRODUCTS[0], quantity: 1 },
        { product: SEED_PRODUCTS[4], quantity: 2 },
      ],
      totalAmount: 125000,
      orderStatus: 'shipped',
      shippingAddress: {
        fullName: 'Marcus Tillman',
        addressLine1: '4820 Harvest Ridge Rd',
        city: 'Ames',
        state: 'Iowa',
        zipCode: '50010',
        phone: '+1 (515) 882-4401',
      },
      estimatedDelivery: '2026-09-28',
      trackingNumber: 'UPS9928174201',
      paymentMethod: 'Transfer Bank',
    });

    console.log('Seeding selesai dengan sukses!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding gagal:', err);
    process.exit(1);
  }
}

seed();
