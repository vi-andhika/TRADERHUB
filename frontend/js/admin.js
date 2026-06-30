// Sample Data
const sampleOrders = [
    { id: 'ORD001', customer: 'Budi Santoso', total: 2500000, status: 'pending', date: '2026-06-30' },
    { id: 'ORD002', customer: 'Siti Nurhaliza', total: 5500000, status: 'processing', date: '2026-06-29' },
    { id: 'ORD003', customer: 'Ahmad Wijaya', total: 1200000, status: 'shipped', date: '2026-06-28' },
    { id: 'ORD004', customer: 'Rina Dewi', total: 3500000, status: 'delivered', date: '2026-06-27' },
    { id: 'ORD005', customer: 'Hendra Kusuma', total: 850000, status: 'pending', date: '2026-06-26' }
];

const sampleUsers = [
    { id: 1, name: 'Budi Santoso', email: 'budi@email.com', phone: '08xx-xxxx-1111', registered: '2026-05-01', status: 'active' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti@email.com', phone: '08xx-xxxx-2222', registered: '2026-05-05', status: 'active' },
    { id: 3, name: 'Ahmad Wijaya', email: 'ahmad@email.com', phone: '08xx-xxxx-3333', registered: '2026-05-10', status: 'inactive' },
    { id: 4, name: 'Rina Dewi', email: 'rina@email.com', phone: '08xx-xxxx-4444', registered: '2026-05-15', status: 'active' },
    { id: 5, name: 'Hendra Kusuma', email: 'hendra@email.com', phone: '08xx-xxxx-5555', registered: '2026-05-20', status: 'active' }
];

const sampleTransactions = [
    { id: 'TRX001', date: '2026-06-30 10:30', amount: 2500000, method: 'card', status: 'success' },
    { id: 'TRX002', date: '2026-06-30 09:15', amount: 5500000, method: 'bank', status: 'success' },
    { id: 'TRX003', date: '2026-06-30 08:45', amount: 1200000, method: 'wallet', status: 'success' },
    { id: 'TRX004', date: '2026-06-29 14:20', amount: 3500000, method: 'cod', status: 'pending' },
    { id: 'TRX005', date: '2026-06-29 11:00', amount: 850000, method: 'card', status: 'success' }
];

// Check if admin is logged in
function checkAdminAuth() {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
        // In real app, redirect to login
        console.log('Admin not logged in - in real app would redirect to login');
    }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadProducts();
    loadOrders();
    loadUsers();
    loadTransactions();
});

// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Add active to clicked nav item
    event.target.classList.add('active');

    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
    }
}

// Load products
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('adminProducts')) || [
        { id: 1, name: 'Smartphone Samsung A12', category: 'elektronik', price: 2500000, stock: 15, rating: 4.5 },
        { id: 2, name: 'Laptop Asus Vivobook', category: 'elektronik', price: 5500000, stock: 8, rating: 4.7 },
        { id: 3, name: 'Tas Ransel Hiking', category: 'fashion', price: 450000, stock: 25, rating: 4.3 },
        { id: 4, name: 'Sepatu Olahraga Nike', category: 'fashion', price: 850000, stock: 30, rating: 4.6 },
        { id: 5, name: 'Blender Electrolux', category: 'rumah-tangga', price: 750000, stock: 12, rating: 4.4 },
        { id: 6, name: 'Kasur Busa Premium', category: 'rumah-tangga', price: 1200000, stock: 6, rating: 4.5 },
        { id: 7, name: 'Dumbell Set 20kg', category: 'olahraga', price: 650000, stock: 18, rating: 4.7 },
        { id: 8, name: 'Bola Basket Spalding', category: 'olahraga', price: 350000, stock: 22, rating: 4.4 }
    ];

    const table = document.getElementById('productsTable');
    table.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td><span class="badge badge-primary">${product.category}</span></td>
            <td>Rp ${formatPrice(product.price)}</td>
            <td>${product.stock}</td>
            <td>⭐ ${product.rating}</td>
            <td>
                <button class="btn btn-primary" onclick="editProduct(${product.id})" style="padding: 0.5rem 1rem; font-size: 0.85em;">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})" style="padding: 0.5rem 1rem; font-size: 0.85em;">Hapus</button>
            </td>
        `;
        table.appendChild(row);
    });

    document.getElementById('totalProducts').textContent = products.length;
}

// Load orders
function loadOrders() {
    const table = document.getElementById('ordersTable');
    table.innerHTML = '';

    sampleOrders.forEach(order => {
        const row = document.createElement('tr');
        const statusBadgeClass = {
            'pending': 'badge-warning',
            'processing': 'badge-info',
            'shipped': 'badge-primary',
            'delivered': 'badge-success',
            'cancelled': 'badge-danger'
        }[order.status] || 'badge-primary';

        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>Rp ${formatPrice(order.total)}</td>
            <td><span class="badge ${statusBadgeClass}">${order.status}</span></td>
            <td>${order.date}</td>
            <td>
                <button class="btn btn-primary" onclick="editOrder('${order.id}')" style="padding: 0.5rem 1rem; font-size: 0.85em;">Detail</button>
                <button class="btn btn-secondary" onclick="updateOrderStatus('${order.id}')" style="padding: 0.5rem 1rem; font-size: 0.85em;">Update</button>
            </td>
        `;
        table.appendChild(row);
    });

    document.getElementById('pendingOrders').textContent = sampleOrders.filter(o => o.status === 'pending').length;
}

// Load users
function loadUsers() {
    const table = document.getElementById('usersTable');
    table.innerHTML = '';

    sampleUsers.forEach(user => {
        const row = document.createElement('tr');
        const statusBadge = user.status === 'active' ? 'badge-success' : 'badge-danger';
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.registered}</td>
            <td><span class="badge ${statusBadge}">${user.status}</span></td>
            <td>
                <button class="btn btn-primary" onclick="editUser(${user.id})" style="padding: 0.5rem 1rem; font-size: 0.85em;">Edit</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})" style="padding: 0.5rem 1rem; font-size: 0.85em;">Hapus</button>
            </td>
        `;
        table.appendChild(row);
    });

    document.getElementById('totalUsers').textContent = sampleUsers.length;
}

// Load transactions
function loadTransactions() {
    const table = document.getElementById('transactionsTable');
    table.innerHTML = '';

    sampleTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        const statusBadge = transaction.status === 'success' ? 'badge-success' : 'badge-warning';
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>Rp ${formatPrice(transaction.amount)}</td>
            <td>${transaction.method}</td>
            <td><span class="badge ${statusBadge}">${transaction.status}</span></td>
            <td>
                <button class="btn btn-primary" onclick="viewTransaction('${transaction.id}')" style="padding: 0.5rem 1rem; font-size: 0.85em;">Lihat</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0
    }).format(price);
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Add product
function addProduct() {
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const desc = document.getElementById('productDesc').value;

    if (!name || !price || !stock) {
        alert('Silakan isi semua field yang diperlukan');
        return;
    }

    alert('✅ Produk berhasil ditambahkan!');
    closeModal('productModal');
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productDesc').value = '';
}

// Edit functions
function editProduct(productId) {
    alert('Edit produk ID: ' + productId);
}

function deleteProduct(productId) {
    if (confirm('Yakin ingin menghapus produk ini?')) {
        alert('✅ Produk berhasil dihapus!');
        loadProducts();
    }
}

function editOrder(orderId) {
    alert('Lihat detail pesanan: ' + orderId);
}

function updateOrderStatus(orderId) {
    const status = prompt('Masukkan status baru (pending/processing/shipped/delivered):');
    if (status) {
        alert('✅ Status pesanan berhasil diubah menjadi: ' + status);
        loadOrders();
    }
}

function editUser(userId) {
    alert('Edit pengguna ID: ' + userId);
}

function deleteUser(userId) {
    if (confirm('Yakin ingin menghapus pengguna ini?')) {
        alert('✅ Pengguna berhasil dihapus!');
        loadUsers();
    }
}

function viewTransaction(transactionId) {
    alert('Lihat detail transaksi: ' + transactionId);
}

// Filter functions
function filterOrders() {
    const status = document.getElementById('statusFilter').value;
    alert('Filter pesanan berdasarkan status: ' + (status || 'Semua'));
    loadOrders();
}

function filterTransactions() {
    const method = document.getElementById('paymentMethod').value;
    alert('Filter transaksi berdasarkan metode: ' + (method || 'Semua'));
    loadTransactions();
}

// Save settings
function saveSettings() {
    const settings = {
        storeName: document.getElementById('storeName').value,
        storeEmail: document.getElementById('storeEmail').value,
        storePhone: document.getElementById('storePhone').value,
        storeAddress: document.getElementById('storeAddress').value
    };

    localStorage.setItem('storeSettings', JSON.stringify(settings));
    alert('✅ Pengaturan toko berhasil disimpan!');
}

// Handle logout
function handleLogout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem('adminUser');
        window.location.href = '../index.html';
    }
}

// Click outside modal to close
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});
