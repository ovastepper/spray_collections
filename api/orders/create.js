import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { requireUser } from '../_lib/auth.js';
import { adminDb } from '../_lib/firebaseAdmin.js';
import { parseBody, requireMethod, safeErrorMessage, sendJson } from '../_lib/http.js';

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    throw new Error('Your cart must contain between 1 and 50 products.');
  }

  const quantities = new Map();
  for (const item of items) {
    const productId = String(item?.id || '').trim();
    const quantity = Number(item?.qty);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error('One or more cart quantities are invalid.');
    }
    quantities.set(productId, (quantities.get(productId) || 0) + quantity);
  }
  return [...quantities.entries()].map(([productId, quantity]) => ({ productId, quantity }));
};

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    const user = await requireUser(request);
    const { items } = parseBody(request);
    const normalizedItems = normalizeItems(items);
    const orderRef = adminDb.collection('orders').doc();
    const profileRef = adminDb.collection('users').doc(user.uid);

    const result = await adminDb.runTransaction(async (transaction) => {
      const profileSnapshot = await transaction.get(profileRef);
      const productSnapshots = [];

      for (const item of normalizedItems) {
        const productRef = adminDb.collection('products').doc(item.productId);
        productSnapshots.push({
          item,
          ref: productRef,
          snapshot: await transaction.get(productRef)
        });
      }

      let total = 0;
      const orderItems = productSnapshots.map(({ item, ref, snapshot }) => {
        if (!snapshot.exists) {
          const error = new Error('A product in your cart no longer exists.');
          error.code = 'PRODUCT_UNAVAILABLE';
          throw error;
        }

        const product = snapshot.data();
        if (!product.available || product.archived) {
          const error = new Error(`${product.name || 'A product'} is currently unavailable.`);
          error.code = 'PRODUCT_UNAVAILABLE';
          throw error;
        }

        const stock = Number(product.stock ?? 0);
        if (product.trackInventory !== false && stock < item.quantity) {
          const error = new Error(
            stock > 0
              ? `Only ${stock} unit(s) of ${product.name} remain.`
              : `${product.name} is out of stock.`
          );
          error.code = 'OUT_OF_STOCK';
          throw error;
        }

        const unitPrice = Number(product.price);
        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
          throw new Error('A product has an invalid price.');
        }

        if (product.trackInventory !== false) {
          transaction.update(ref, {
            stock: stock - item.quantity,
            available: stock - item.quantity > 0,
            updatedAt: FieldValue.serverTimestamp()
          });
        }

        const lineTotal = unitPrice * item.quantity;
        total += lineTotal;
        return {
          id: snapshot.id,
          name: product.name,
          category: product.category || '',
          qty: item.quantity,
          price: unitPrice,
          lineTotal
        };
      });

      const profile = profileSnapshot.exists ? profileSnapshot.data() : {};
      const orderNumber = `ORD-${orderRef.id.slice(0, 8).toUpperCase()}`;
      const customerName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
        || user.name
        || user.email
        || 'Customer';
      const now = Timestamp.now();

      transaction.set(orderRef, {
        orderNumber,
        userId: user.uid,
        customer: customerName,
        customerEmail: user.email || profile.email || '',
        customerPhone: profile.phone || '',
        deliveryAddress: profile.address || '',
        items: orderItems,
        subtotal: total,
        shipping: 0,
        total,
        currency: 'GHS',
        status: 'Pending',
        statusHistory: [{
          status: 'Pending',
          at: now,
          by: user.uid,
          note: 'Order placed'
        }],
        createdAt: now,
        updatedAt: now
      });

      return { orderId: orderRef.id, orderNumber, total };
    });

    sendJson(response, 201, { success: true, ...result });
  } catch (error) {
    console.error('Order creation failed:', error);
    sendJson(response, error.status || 400, {
      success: false,
      message: safeErrorMessage(error, error.status ? error.message : 'Unable to place the order.')
    });
  }
}
