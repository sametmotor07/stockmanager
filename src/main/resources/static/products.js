const loginStatus = document.getElementById('loginStatus');
const loginButton = document.getElementById('loginButton');
const reloadProducts = document.getElementById('reloadProducts');
const productsTableBody = document.getElementById('productsTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const addProductButton = document.getElementById('addProductButton');
const newName = document.getElementById('newName');
const newCategory = document.getElementById('newCategory');
const newStock = document.getElementById('newStock');
const newPrice = document.getElementById('newPrice');
const deletedYearInput = document.getElementById('deletedYear');
const deletedMonthSelect = document.getElementById('deletedMonth');
const loadDeletedButton = document.getElementById('loadDeletedButton');
const deletedTableBody = document.getElementById('deletedTableBody');

let products = [];

function updateStatus(text, success = true) {
  loginStatus.innerHTML = `Bağlantı: <span>${text}</span>`;
  loginStatus.style.background = success ? 'rgba(123, 92, 255, 0.08)' : 'rgba(255, 75, 115, 0.14)';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value);
}

function getFilteredProducts() {
  const searchText = searchInput.value.trim().toLowerCase();
  const categoryValue = categoryFilter.value;

  return products.filter(product => {
    const matchesSearch = [product.name, product.category].some(field =>
      field?.toString().toLowerCase().includes(searchText)
    );
    const matchesCategory = categoryValue ? product.category === categoryValue : true;
    return matchesSearch && matchesCategory;
  });
}

function renderCategoryOptions() {
  const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean))).sort();
  const previous = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="">Tüm Kategoriler</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  if (categories.includes(previous)) {
    categoryFilter.value = previous;
  }
}

function renderProductsTable() {
  const filteredProducts = getFilteredProducts();
  productsTableBody.innerHTML = '';

  if (!filteredProducts.length) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="6" class="empty-state">Kriterlere uygun ürün bulunamadı.</td>';
    productsTableBody.appendChild(emptyRow);
    return;
  }

  filteredProducts.forEach(product => {
    const row = document.createElement('tr');
    row.dataset.id = product.id;
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.stock}</td>
      <td>${formatCurrency(product.price)}</td>
      <td>
        <div class="action-buttons">
          <button class="action-button edit-button">Düzenle</button>
          <button class="action-button danger delete-button">Sil</button>
        </div>
      </td>
    `;

    row.querySelector('.edit-button').addEventListener('click', () => startEditProduct(row, product));
    row.querySelector('.delete-button').addEventListener('click', () => deleteProduct(product.id));
    productsTableBody.appendChild(row);
  });
}

function createInputCell(value, type = 'text') {
  const cell = document.createElement('td');
  const input = document.createElement('input');
  input.type = type;
  input.value = value ?? '';
  input.className = 'input';
  cell.appendChild(input);
  return cell;
}

function createActionCell(saveHandler, cancelHandler) {
  const cell = document.createElement('td');
  const wrapper = document.createElement('div');
  wrapper.className = 'action-buttons';

  const saveButton = document.createElement('button');
  saveButton.className = 'action-button';
  saveButton.textContent = 'Kaydet';
  saveButton.addEventListener('click', saveHandler);

  const cancelButton = document.createElement('button');
  cancelButton.className = 'action-button danger';
  cancelButton.textContent = 'İptal';
  cancelButton.addEventListener('click', cancelHandler);

  wrapper.appendChild(saveButton);
  wrapper.appendChild(cancelButton);
  cell.appendChild(wrapper);
  return cell;
}

function startEditProduct(row, product) {
  row.innerHTML = '';
  row.appendChild(document.createElement('td')).textContent = product.id;
  row.appendChild(createInputCell(product.name));
  row.appendChild(createInputCell(product.category));
  row.appendChild(createInputCell(product.stock, 'number'));
  row.appendChild(createInputCell(product.price, 'number'));
  row.appendChild(createActionCell(
    async () => await saveProductEdit(row, product),
    () => renderProductsTable()
  ));
}

async function saveProductEdit(row, product) {
  const inputs = row.querySelectorAll('input');
  const updatedProduct = {
    name: inputs[0].value.trim(),
    category: inputs[1].value.trim(),
    stock: Number(inputs[2].value),
    price: Number(inputs[3].value),
  };

  if (!updatedProduct.name || !updatedProduct.category) {
    alert('Ürün adı ve kategori alanları zorunludur.');
    return;
  }

  try {
    await window.auth.fetchWithAuth(`/${product.id}`, {
      method: 'PUT',
      body: updatedProduct,
    });
    await loadProducts();
  } catch (error) {
    alert('Ürün güncellenemedi. Konsolu kontrol edin.');
    console.error(error);
  }
}

async function deleteProduct(id) {
  if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
    return;
  }
  try {
    await window.auth.fetchWithAuth(`/${id}`, { method: 'DELETE' });
    await loadProducts();
  } catch (error) {
    alert('Ürün silinemedi. Konsolu kontrol edin.');
    console.error(error);
  }
}

async function addProduct() {
  const newProduct = {
    name: newName.value.trim(),
    category: newCategory.value.trim(),
    stock: Number(newStock.value),
    price: Number(newPrice.value),
  };

  if (!newProduct.name || !newProduct.category) {
    alert('Lütfen ürün adı ve kategori giriniz.');
    return;
  }

  try {
    await window.auth.fetchWithAuth('', {
      method: 'POST',
      body: newProduct,
    });
    newName.value = '';
    newCategory.value = '';
    newStock.value = 0;
    newPrice.value = 0.0;
    await loadProducts();
  } catch (error) {
    alert('Ürün eklenemedi. Konsolu kontrol edin.');
    console.error(error);
  }
}

async function loadProducts() {
  try {
    updateStatus('Yükleniyor...', true);
    products = await window.auth.fetchWithAuth();
    renderCategoryOptions();
    renderProductsTable();
    updateStatus('Bağlantı başarılı', true);
  } catch (error) {
    updateStatus('Bağlantı başarısız', false);
    productsTableBody.innerHTML = '<tr><td colspan="6" class="empty-state">API erişimi sağlanamadı.</td></tr>';
    console.error(error);
  }
}

function formatDeletedAt(dateString) {
  if (!dateString) {
    return '-';
  }
  const date = new Date(dateString);
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function renderDeletedTable(deletedProducts) {
  deletedTableBody.innerHTML = '';

  if (!deletedProducts.length) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="6" class="empty-state">Bu kriterde silinen ürün bulunamadı.</td>';
    deletedTableBody.appendChild(emptyRow);
    return;
  }

  deletedProducts.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.stock}</td>
      <td>${formatCurrency(product.price)}</td>
      <td>${formatDeletedAt(product.deletedAt)}</td>
    `;
    deletedTableBody.appendChild(row);
  });
}

async function loadDeletedProducts() {
  try {
    const year = deletedYearInput.value.trim();
    const month = deletedMonthSelect.value;
    let query = '';

    if (year) {
      query += `year=${encodeURIComponent(year)}`;
    }
    if (month) {
      query += query ? `&month=${encodeURIComponent(month)}` : `month=${encodeURIComponent(month)}`;
    }

    const path = query ? `/deleted?${query}` : '/deleted';
    const deletedProducts = await window.auth.fetchWithAuth(path);
    renderDeletedTable(deletedProducts);
  } catch (error) {
    updateStatus('Bağlantı başarısız', false);
    deletedTableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Silinen ürünler yüklenemedi.</td></tr>';
    console.error(error);
  }
}

loginButton.addEventListener('click', () => {
  loadProducts();
  loadDeletedProducts();
});
reloadProducts.addEventListener('click', () => {
  loadProducts();
  loadDeletedProducts();
});
loadDeletedButton.addEventListener('click', loadDeletedProducts);
searchInput.addEventListener('input', renderProductsTable);
categoryFilter.addEventListener('change', renderProductsTable);
addProductButton.addEventListener('click', addProduct);

loadProducts();
loadDeletedProducts();
