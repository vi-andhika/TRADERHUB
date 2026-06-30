// API Configuration
const API_URL = 'http://localhost:3000/api';

// Sample Products Data (dipakai sebagai fallback kalau backend belum ada data / gagal connect)
const fallbackProducts = [
    {
        id: 1,
        name: 'Smartphone Samsung A12',
        category: 'elektronik',
        price: 2500000,
        image: '📱',
        seller: 'Toko Elektronik Jaya',
        description: 'Smartphone Samsung A12 dengan kondisi seperti baru, garansi resmi 2 tahun',
        rating: 4.5,
        reviews: 245,
        stock: 15
    },
    {
        id: 2,
        name: 'Laptop Asus Vivobook',
        category: 'elektronik',
        price: 5500000,
        image: '💻',
        seller: 'Tech Store Premium',
        description: 'Laptop Asus Vivobook dengan prosesor Intel i5, RAM 8GB, SSD 512GB',
        rating: 4.7,
        reviews: 189,
        stock: 8
    },
    {
        id: 3,
        name: 'Tas Ransel Hiking',
        category: 'fashion',
        price: 450000,
        image: '🎒',
        seller: 'Adventure Gear',
        description: 'Tas ransel berkualitas tinggi untuk hiking dan travelling dengan kapasitas 50 liter',
        rating: 4.3,
        reviews: 567,
        stock: 25
    },
    {
        id: 4,
        name: 'Sepatu Olahraga Nike',
        category: 'fashion',
        price: 850000,
        image: '👟',
        seller: 'Shoes Center',
        description: 'Sepatu olahraga Nike original dengan teknologi Air Max terbaru',
        rating: 4.6,
        reviews: 432,
        stock: 12
    },
    {
        id: 5,
        name: 'Blender Electrolux',
        category: 'rumah-tangga',
        price: 650000,
        image: '🥤',
        seller: 'Elektronik Dapur Jaya',
        description: 'Blender Electrolux dengan 5 kecepatan dan garansi 2 tahun',
        rating: 4.4,
        reviews: 298,
        stock: 18
    },
    {
        id: 6,
        name: 'Kasur Busa Premium',
        category: 'rumah-tangga',
        price: 1500000,
        image: '🛏️',
        seller: 'Toko Furniture Sejahtera',
        description: 'Kasur busa premium dengan ketebalan 20cm, nyaman dan tahan lama',
        rating: 4.8,
        reviews: 156,
        stock: 7
    },
    {
        id: 7,
        name: 'Dumbell Set 20kg',
        category: 'olahraga',
        price: 550000,
        image: '🏋️',
        seller: 'Fitness Zone',
        description: 'Set dumbel 20kg dengan stand, cocok untuk latihan di rumah',
        rating: 4.5,
        reviews: 213,
        stock: 20
    },
    {
        id: 8,
        name: 'Bola Basket Spalding',
        category: 'olahraga',
        price: 280000,
        image: '🏀',
        seller: 'Sports Equipment Store',
        description: 'Bola basket Spalding original, standar internasional',
        rating: 4.7,
        reviews: 189,
        stock: 30
    }
];

// Global Variables
let currentUser = null;
let allProducts = [];
let filteredProducts = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
});

// Ambil produk dari backend. Kalau gagal / database masih kosong, pakai data dummy.
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            // Sesuaikan field dari backend (image_url, dll) ke format yang dipakai tampilan
            allProducts = result.data.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price,
                image: p.image_url || '📦',
                seller: p.seller_id || 'Official Store',
                description: p.description,
                rating: p.rating || 4.5,
                reviews: p.reviews_count || 0,
                stock: p.stock
            }));
            console.log('✅ Produk dimuat dari backend:', allProducts.length);
        } else {
            console.warn('⚠️ Database produk masih kosong, memakai data contoh');
            allProducts = fallbackProducts;
        }
    } catch (error) {
        console.warn('⚠️ Gagal konek ke backend, memakai data contoh:', error.message);
        allProducts = fallbackProducts;
    }

    filteredProducts = [...allProducts];
    displayProducts(allProducts);
}

// Display products in grid
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #718096;">Tidak ada produk yang sesuai dengan filter Anda</p>';
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <div class="product-image">${product.image}</div>
        </div>
        <div class="card-body">
            <div class="product-name">${product.name}</div>
            <div class="product-price">Rp ${formatPrice(product.price)}</div>
            <div class="product-seller">👤 ${product.seller}</div>
            <div class="product-stats">
                <div class="stat">
                    <span class="stat-value">⭐ ${product.rating}</span>
                    <span class="stat-label">${product.reviews} review</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${product.stock}</span>
                    <span class="stat-label">Tersedia</span>
                </div>
            </div>
            <p class="product-description">${product.description.substring(0, 80)}...</p>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="showProductDetail(${product.id})">Lihat Detail</button>
                <button class="btn btn-outline" onclick="addToCart(${product.id})">🛒 Keranjang</button>
            </div>
        </div>
    `;
    return card;
}

// Format currency
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Show product detail in modal
function showProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('detailProductName').textContent = product.name;
    document.getElementById('detailProductImage').textContent = product.image;
    document.getElementById('detailProductPrice').textContent = 'Rp ' + formatPrice(product.price);
    document.getElementById('detailProductDescription').textContent = product.description;
    document.getElementById('detailProductSeller').textContent = '👤 ' + product.seller;
    document.getElementById('detailProductRating').textContent = '⭐ ' + product.rating + ' (' + product.reviews + ' reviews)';
    document.getElementById('detailProductStock').textContent = product.stock + ' tersedia';

    openModal('detailModal');
}

// Search products
function searchProducts() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    if (searchValue === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue)
        );
    }

    displayProducts(filteredProducts);
}

// Filter products
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;

    filteredProducts = allProducts.filter(product => {
        const categoryMatch = categoryFilter === '' || product.category === categoryFilter;
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });

    displayProducts(filteredProducts);
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Handle Login
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Silakan isi email dan password');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();

        if (!result.success) {
            alert('Login gagal: ' + (result.error || 'Terjadi kesalahan'));
            return;
        }

        currentUser = result.data;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('loginModal');
        alert('✅ Login berhasil! Selamat datang ' + currentUser.name);
    } catch (error) {
        alert('Tidak bisa terhubung ke server. Pastikan backend sedang berjalan.');
    }
}

// Handle Register
async function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;

    if (!name || !email || !password || !confirm) {
        alert('Silakan isi semua field');
        return;
    }

    if (password !== confirm) {
        alert('Password tidak cocok');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();

        if (!result.success) {
            alert('Pendaftaran gagal: ' + (result.error || 'Terjadi kesalahan'));
            return;
        }

        currentUser = result.data;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('registerModal');
        alert('Pendaftaran berhasil! Selamat datang ' + name);
    } catch (error) {
        alert('Tidak bisa terhubung ke server. Pastikan backend sedang berjalan.');
    }
}

// Add to cart
function addToCart(productId) {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu');
        openModal('loginModal');
        return;
    }

    const product = allProducts.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ Produk ditambahkan ke keranjang!');
}

// Buy product
function buyProduct() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu');
        closeModal('detailModal');
        openModal('loginModal');
        return;
    }

    alert('✅ Pembelian berhasil! Terima kasih telah berbelanja di TradeHub');
    closeModal('detailModal');
}

// Load user from localStorage on page load
if (localStorage.getItem('currentUser')) {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
}

// Initialize products on page load
displayProducts(allProducts);
