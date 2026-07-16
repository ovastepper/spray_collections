import { FieldValue } from 'firebase-admin/firestore';
import { requireAdmin } from '../../_lib/auth.js';
import { adminDb } from '../../_lib/firebaseAdmin.js';
import { parseBody, requireMethod, sendJson } from '../../_lib/http.js';

const allowedFields = [
  'name',
  'description',
  'category',
  'slug',
  'price',
  'stock',
  'lowStockThreshold',
  'trackInventory',
  'available'
];

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    await requireAdmin(request);
    const { productId, changes = {} } = parseBody(request);
    if (!productId) {
      return sendJson(response, 400, { success: false, message: 'A product ID is required.' });
    }

    const sanitized = {};
    for (const field of allowedFields) {
      if (Object.hasOwn(changes, field)) sanitized[field] = changes[field];
    }

    if (Object.hasOwn(sanitized, 'price')) {
      sanitized.price = Number(sanitized.price);
      if (!Number.isFinite(sanitized.price) || sanitized.price < 0) throw new Error('Price must be zero or higher.');
    }
    if (Object.hasOwn(sanitized, 'stock')) {
      sanitized.stock = Number(sanitized.stock);
      if (!Number.isInteger(sanitized.stock) || sanitized.stock < 0) throw new Error('Stock must be a whole number.');
      if (sanitized.stock === 0) sanitized.available = false;
    }
    if (Object.hasOwn(sanitized, 'lowStockThreshold')) {
      sanitized.lowStockThreshold = Number(sanitized.lowStockThreshold);
      if (!Number.isInteger(sanitized.lowStockThreshold) || sanitized.lowStockThreshold < 0) {
        throw new Error('Low-stock threshold must be a whole number.');
      }
    }

    sanitized.updatedAt = FieldValue.serverTimestamp();
    await adminDb.collection('products').doc(productId).update(sanitized);
    sendJson(response, 200, { success: true });
  } catch (error) {
    console.error('Product update failed:', error);
    sendJson(response, error.status || 400, { success: false, message: error.message || 'Unable to update the product.' });
  }
}
