// Script untuk mengisi data contoh ke database lewat API backend.
// Cara pakai: jalankan backend dulu (npm start), lalu di terminal lain jalankan:
//   node seed.js
// dari dalam folder backend.

const API_URL = 'http://localhost:3000/api';

const sampleProducts = [
    { name: 'Smartphone Samsung A12', category: 'elektronik', price: 2500000, stock: 15, description: 'Smartphone Samsung A12 dengan kondisi seperti baru, garansi resmi 2 tahun', image_url: '📱' },
    { name: 'Laptop Asus Vivobook', category: 'elektronik', price: 5500000, stock: 8, description: 'Laptop Asus Vivobook dengan prosesor Intel i5, RAM 8GB, SSD 512GB', image_url: '💻' },
    { name: 'Tas Ransel Hiking', category: 'fashion', price: 450000, stock: 25, description: 'Tas ransel berkualitas tinggi untuk hiking dan travelling kapasitas 50 liter', image_url: '🎒' },
    { name: 'Sepatu Olahraga Nike', category: 'fashion', price: 850000, stock: 30, description: 'Sepatu olahraga Nike original dengan teknologi Air Max terbaru', image_url: '👟' },
    { name: 'Blender Electrolux', category: 'rumah-tangga', price: 750000, stock: 12, description: 'Blender Electrolux berkualitas dengan motor yang kuat dan tahan lama', image_url: '🍹' },
    { name: 'Kasur Busa Premium', category: 'rumah-tangga', price: 1200000, stock: 6, description: 'Kasur busa premium ukuran queen dengan foam berkualitas tinggi', image_url: '🛏️' },
    { name: 'Dumbell Set 20kg', category: 'olahraga', price: 650000, stock: 18, description: 'Set dumbell besi cor 20kg dengan stand untuk home gym', image_url: '🏋️' },
    { name: 'Bola Basket Spalding', category: 'olahraga', price: 350000, stock: 22, description: 'Bola basket Spalding original untuk outdoor dan indoor', image_url: '🏀' }
];

async function main() {
    console.log('🌱 Mulai seeding data...\n');

    // 1. Buat (atau login) user seller untuk dipakai sebagai pemilik produk
    let sellerId;
    const sellerEmail = 'seller@tradehub.com';
    const sellerPassword = 'password123';

    let res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Toko Contoh', email: sellerEmail, password: sellerPassword })
    });
    let data = await res.json();

    if (data.success) {
        sellerId = data.data.id;
        console.log(`✅ User seller dibuat (id: ${sellerId})`);
    } else {
        // Kemungkinan user sudah ada dari run sebelumnya, coba login saja
        console.log('ℹ️  User seller sudah ada, mencoba login...');
        res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: sellerEmail, password: sellerPassword })
        });
        data = await res.json();
        if (!data.success) {
            console.error('❌ Gagal membuat/login user seller:', data.error);
            process.exit(1);
        }
        sellerId = data.data.id;
        console.log(`✅ Login sebagai seller (id: ${sellerId})`);
    }

    // 2. Insert semua produk contoh
    let created = 0;
    for (const product of sampleProducts) {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...product, seller_id: sellerId })
        });
        const data = await res.json();
        if (data.success) {
            created++;
            console.log(`  ✅ ${product.name}`);
        } else {
            console.log(`  ⚠️  Gagal: ${product.name} - ${data.error}`);
        }
    }

    console.log(`\n🎉 Selesai! ${created}/${sampleProducts.length} produk berhasil ditambahkan.`);
    console.log('Sekarang buka frontend/index.html dan refresh halaman.');
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    console.error('Pastikan backend sedang berjalan di http://localhost:3000');
});