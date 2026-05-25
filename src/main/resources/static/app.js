const loginStatus = document.getElementById('loginStatus');
const statProducts = document.getElementById('statProducts');
const statCategories = document.getElementById('statCategories');
const statStock = document.getElementById('statStock');
const statValue = document.getElementById('statValue');
const recentProducts = document.getElementById('recentProducts');
const loginButton = document.getElementById('loginButton');
const refreshData = document.getElementById('refreshData');
const refreshCards = document.getElementById('refreshCards');

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value);
}

function updateStatus(text, success = true) {
  loginStatus.innerHTML = `Bağlantı: <span>${text}</span>`;
  loginStatus.style.background = success ? 'rgba(123, 92, 255, 0.08)' : 'rgba(255, 75, 115, 0.14)';
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <div>
      <h4>${product.name}</h4>
      <p>${product.category || 'Kategori yok'}</p>
    </div>
    <div class="card-footer">
      <span>${product.stock} adet</span>
      <strong>${formatCurrency(product.price)}</strong>
    </div>
  `;
  return card;
}

function renderRecent(products) {
  recentProducts.innerHTML = '';
  if (!products.length) {
    recentProducts.innerHTML = '<div class="empty-state">Hiç ürün bulunamadı.</div>';
    return;
  }
  const sorted = [...products].sort((a, b) => b.id - a.id).slice(0, 6);
  sorted.forEach(product => recentProducts.appendChild(createProductCard(product)));
}

function updateStats(products) {
  const categories = new Set(products.map(product => product.category).filter(Boolean));
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock), 0);
  const inventoryValue = products.reduce((sum, product) => sum + Number(product.stock) * Number(product.price), 0);

  statProducts.textContent = products.length;
  statCategories.textContent = categories.size;
  statStock.textContent = totalStock;
  statValue.textContent = formatCurrency(inventoryValue);
}

async function loadDashboard() {
  try {
    updateStatus('Yükleniyor...', true);
    const products = await window.auth.fetchWithAuth();
    updateStats(products);
    renderRecent(products);
    updateStatus('Bağlantı başarılı', true);
  } catch (error) {
    updateStatus('Bağlantı başarısız', false);
    recentProducts.innerHTML = '<div class="empty-state">API erişimi sağlanamadı. Lütfen backend çalışıyor mu kontrol edin.</div>';
    statProducts.textContent = '—';
    statCategories.textContent = '—';
    statStock.textContent = '—';
    statValue.textContent = '—';
    console.error(error);
  }
}

loginButton.addEventListener('click', loadDashboard);
refreshData.addEventListener('click', loadDashboard);
refreshCards.addEventListener('click', loadDashboard);

loadDashboard();
