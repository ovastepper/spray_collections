import { FieldValue } from 'firebase-admin/firestore';
import { requireAdmin } from '../../_lib/auth.js';
import { adminDb } from '../../_lib/firebaseAdmin.js';
import { parseBody, requireMethod, sendJson } from '../../_lib/http.js';

const allowedProductFields = [
  'id',
  'name',
  'category',
  'slug',
  'price',
  'description',
  'available',
  'sortIndex',
  'stock',
  'lowStockThreshold',
  'trackInventory',
  'archived'
];

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    await requireAdmin(request);
    const { products = [], companyInfo = {} } = parseBody(request);
    if (!Array.isArray(products) || products.length === 0 || products.length > 500) {
      return sendJson(response, 400, { success: false, message: 'A valid initial catalogue is required.' });
    }

    const seedRef = adminDb.collection('meta').doc('catalog-v1');
    if ((await seedRef.get()).exists) {
      return sendJson(response, 200, { success: true, seeded: false });
    }

    for (let start = 0; start < products.length; start += 400) {
      const batch = adminDb.batch();
      products.slice(start, start + 400).forEach((product, offset) => {
        const sanitized = {};
        for (const field of allowedProductFields) {
          if (Object.hasOwn(product, field)) sanitized[field] = product[field];
        }
        const productId = String(sanitized.id || '').trim();
        if (!productId) throw new Error('Every seed product needs an ID.');
        delete sanitized.id;
        batch.set(adminDb.collection('products').doc(productId), {
          ...sanitized,
          sortIndex: Number.isInteger(sanitized.sortIndex) ? sanitized.sortIndex : start + offset,
          stock: Number.isInteger(sanitized.stock) ? sanitized.stock : 10,
          lowStockThreshold: Number.isInteger(sanitized.lowStockThreshold) ? sanitized.lowStockThreshold : 3,
          trackInventory: sanitized.trackInventory !== false,
          archived: sanitized.archived === true,
          updatedAt: FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
    }

    await adminDb.collection('settings').doc('company').set(companyInfo, { merge: true });
    await seedRef.set({
      seededAt: FieldValue.serverTimestamp(),
      productCount: products.length
    });
    sendJson(response, 200, { success: true, seeded: true, productCount: products.length });
  } catch (error) {
    console.error('Catalogue seed failed:', error);
    sendJson(response, error.status || 500, { success: false, message: error.message || 'Unable to seed the catalogue.' });
  }
}
