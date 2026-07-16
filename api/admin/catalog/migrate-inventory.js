import { FieldValue } from 'firebase-admin/firestore';
import { requireAdmin } from '../../_lib/auth.js';
import { adminDb } from '../../_lib/firebaseAdmin.js';
import { requireMethod, sendJson } from '../../_lib/http.js';

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    await requireAdmin(request);
    const migrationRef = adminDb.collection('meta').doc('inventory-v1');
    const migrationSnapshot = await migrationRef.get();
    if (migrationSnapshot.exists) {
      return sendJson(response, 200, { success: true, migrated: false });
    }

    const productsSnapshot = await adminDb.collection('products').get();
    for (let start = 0; start < productsSnapshot.docs.length; start += 400) {
      const batch = adminDb.batch();
      for (const productSnapshot of productsSnapshot.docs.slice(start, start + 400)) {
        const product = productSnapshot.data();
        batch.update(productSnapshot.ref, {
          stock: Number.isInteger(product.stock) ? product.stock : 10,
          lowStockThreshold: Number.isInteger(product.lowStockThreshold) ? product.lowStockThreshold : 3,
          trackInventory: product.trackInventory !== false,
          archived: product.archived === true,
          updatedAt: FieldValue.serverTimestamp()
        });
      }
      await batch.commit();
    }

    await migrationRef.set({
      completedAt: FieldValue.serverTimestamp(),
      productCount: productsSnapshot.size
    });
    sendJson(response, 200, { success: true, migrated: true, productCount: productsSnapshot.size });
  } catch (error) {
    console.error('Inventory migration failed:', error);
    sendJson(response, error.status || 500, { success: false, message: error.message || 'Unable to initialize inventory.' });
  }
}
