# TradeHub E-Commerce Platform

Aplikasi website jual-beli online lengkap dengan halaman admin dan backend API.

## 📁 Struktur Folder

```
belajar bikin web/
├── frontend/
│   ├── index.html              # Halaman utama (customer)
│   ├── css/
│   │   └── style.css           # Stylesheet global
│   ├── js/
│   │   ├── main.js             # JavaScript halaman utama
│   │   └── admin.js            # JavaScript halaman admin
│   └── admin/
│       └── dashboard.html       # Dashboard admin
├── backend/
│   ├── server.js               # Entry point Express.js
│   ├── package.json            # Dependencies Node.js
│   ├── .env                    # Environment variables
│   ├── config/
│   │   └── database.js         # Konfigurasi database SQLite
│   ├── models/
│   │   ├── Product.js          # Model produk
│   │   ├── User.js             # Model pengguna
│   │   └── Order.js            # Model pesanan
│   └── routes/
│       ├── products.js         # Route produk
│       ├── orders.js           # Route pesanan
│       ├── users.js            # Route pengguna
│       └── auth.js             # Route autentikasi
└── README.md                   # Dokumentasi ini
```

## 🚀 Cara Menjalankan

### Frontend (Customer & Admin)

1. Buka `frontend/index.html` di browser untuk halaman customer
2. Buka `frontend/admin/dashboard.html` di browser untuk halaman admin

**Fitur Frontend:**

- ✅ Tampilan produk dengan filter & pencarian
- ✅ Login & Registrasi user
- ✅ Detail produk dengan modal
- ✅ Keranjang belanja (localStorage)
- ✅ Admin Dashboard lengkap
- ✅ Manajemen produk, pesanan, pengguna, transaksi
- ✅ Responsive design

### Backend (Node.js + Express)

1. Instalasi dependencies:

```bash
cd backend
npm install
```

2. Jalankan server:

```bash
npm start
# atau untuk development dengan auto-reload:
npm run dev
```

3. Server akan berjalan di `http://localhost:3000`

**Fitur Backend:**

- ✅ REST API untuk produk, pesanan, pengguna
- ✅ Autentikasi dengan JWT
- ✅ Database SQLite
- ✅ Password hashing dengan bcryptjs
- ✅ CORS enabled

## 📚 API Endpoints

### Products

- `GET /api/products` - Dapatkan semua produk
- `GET /api/products/search?q=keyword` - Cari produk
- `GET /api/products/:id` - Dapatkan detail produk
- `POST /api/products` - Buat produk baru
- `PUT /api/products/:id` - Update produk
- `DELETE /api/products/:id` - Hapus produk

### Orders

- `GET /api/orders` - Dapatkan semua pesanan
- `GET /api/orders/:id` - Dapatkan detail pesanan
- `POST /api/orders` - Buat pesanan baru
- `PUT /api/orders/:id/status` - Update status pesanan
- `DELETE /api/orders/:id` - Batalkan pesanan

### Users

- `GET /api/users` - Dapatkan semua pengguna
- `GET /api/users/:id` - Dapatkan detail pengguna
- `POST /api/users` - Buat pengguna baru
- `PUT /api/users/:id` - Update pengguna
- `DELETE /api/users/:id` - Hapus pengguna

### Authentication

- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/register` - Registrasi pengguna
- `POST /api/auth/verify` - Verifikasi token

## 🎨 Fitur

### Frontend Customer

- Tampilkan 8 produk sample
- Filter berdasarkan kategori dan harga
- Pencarian produk real-time
- Modal login/registrasi
- Modal detail produk
- Tambah ke keranjang
- Responsive design

### Frontend Admin

- Dashboard dengan statistik
- Manajemen produk (CRUD)
- Manajemen pesanan
- Manajemen pengguna
- Riwayat transaksi
- Pengaturan toko
- Sidebar navigation

### Backend

- RESTful API dengan Express.js
- Database SQLite dengan schema lengkap
- Autentikasi JWT
- Password hashing dengan bcryptjs
- Error handling
- CORS middleware

## 💾 Database

Database SQLite dengan tabel:

- `users` - Data pengguna
- `products` - Data produk
- `orders` - Data pesanan
- `order_items` - Item dalam pesanan
- `transactions` - Riwayat transaksi
- `reviews` - Review produk

## 🔐 Autentikasi

Menggunakan JWT (JSON Web Tokens) untuk autentikasi API. Token dikirim di header Authorization:

```
Authorization: Bearer <token>
```

## 📝 Contoh Request API

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Dapatkan Produk

```bash
curl http://localhost:3000/api/products?category=elektronik&min_price=0&max_price=5000000
```

### Buat Pesanan

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "total_amount": 2500000,
    "items": [
      {"product_id": 1, "quantity": 1, "unit_price": 2500000, "subtotal": 2500000}
    ]
  }'
```

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Security**: bcryptjs, JWT
- **Other**: CORS, body-parser

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Kontribusi

Feel free untuk fork dan improve aplikasi ini!

## 📄 License

MIT License

---

**Dibuat dengan ❤️ untuk pembelajaran web development**
