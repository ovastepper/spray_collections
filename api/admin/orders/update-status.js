import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { requireAdmin } from '../../_lib/auth.js';
import { adminDb } from '../../_lib/firebaseAdmin.js';
import { parseBody, requireMethod, sendJson } from '../../_lib/http.js';

const transitions = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Ready', 'Cancelled'],
  Ready: ['Delivered', 'Cancelled'],
  Delivered: [],
  Cancelled: []
};

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    const admin = await requireAdmin(request);
    const { orderId, status, note = '' } = parseBody(request);
    if (!orderId || !Object.hasOwn(transitions, status)) {
      return sendJson(response, 400, { success: false, message: 'A valid order and status are required.' });
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    await adminDb.runTransaction(async (transaction) => {
      const orderSnapshot = await transaction.get(orderRef);
      if (!orderSnapshot.exists) throw new Error('Order not found.');

      const order = orderSnapshot.data();
      const allowed = transitions[order.status] || [];
      if (!allowed.includes(status)) {
        throw new Error(`An order cannot move from ${order.status} to ${status}.`);
      }

      if (status === 'Cancelled' && !order.inventoryRestored) {
        const inventoryProducts = [];
        for (const item of order.items || []) {
          const productRef = adminDb.collection('products').doc(item.id);
          const productSnapshot = await transaction.get(productRef);
          inventoryProducts.push({ item, productRef, productSnapshot });
        }

        for (const { item, productRef, productSnapshot } of inventoryProducts) {
          if (productSnapshot.exists && productSnapshot.data().trackInventory !== false) {
            const product = productSnapshot.data();
            const restoredStock = Number(product.stock || 0) + Number(item.qty || 0);
            transaction.update(productRef, {
              stock: restoredStock,
              available: restoredStock > 0,
              updatedAt: FieldValue.serverTimestamp()
            });
          }
        }
      }

      transaction.update(orderRef, {
        status,
        inventoryRestored: status === 'Cancelled' ? true : order.inventoryRestored || false,
        statusHistory: FieldValue.arrayUnion({
          status,
          at: Timestamp.now(),
          by: admin.uid,
          note: String(note).slice(0, 300)
        }),
        updatedAt: FieldValue.serverTimestamp()
      });
    });

    sendJson(response, 200, { success: true });
  } catch (error) {
    console.error('Order status update failed:', error);
    sendJson(response, error.status || 400, { success: false, message: error.message || 'Unable to update the order.' });
  }
}
