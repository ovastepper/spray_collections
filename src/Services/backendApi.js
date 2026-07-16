import { auth } from '../config/firebase';

const request = async (path, body) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in before continuing.');

  const token = await user.getIdToken();
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body || {})
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'The backend request failed.');
  }
  return result;
};

export const createOrder = (items) => request('/api/orders/create', {
  items: items.map((item) => ({ id: item.id, qty: item.qty }))
});

export const changeOrderStatus = (orderId, status, note = '') => (
  request('/api/admin/orders/update-status', { orderId, status, note })
);

export const saveInventoryProduct = (productId, changes) => (
  request('/api/admin/products/update', { productId, changes })
);

export const archiveInventoryProduct = (productId) => (
  request('/api/admin/products/archive', { productId })
);

export const migrateInventory = () => request('/api/admin/catalog/migrate-inventory');

export const seedCatalog = (products, companyInfo) => request('/api/admin/catalog/seed', {
  products: products.map((entry, sortIndex) => {
    const product = { ...entry };
    delete product.image;
    return { ...product, sortIndex };
  }),
  companyInfo
});
