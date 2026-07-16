import { FieldValue } from 'firebase-admin/firestore';
import { requireAdmin } from '../../_lib/auth.js';
import { adminDb } from '../../_lib/firebaseAdmin.js';
import { parseBody, requireMethod, sendJson } from '../../_lib/http.js';

export default async function handler(request, response) {
  if (!requireMethod(request, response, 'POST')) return;

  try {
    await requireAdmin(request);
    const { productId } = parseBody(request);
    if (!productId) {
      return sendJson(response, 400, { success: false, message: 'A product ID is required.' });
    }

    await adminDb.collection('products').doc(productId).update({
      archived: true,
      available: false,
      updatedAt: FieldValue.serverTimestamp()
    });
    sendJson(response, 200, { success: true });
  } catch (error) {
    console.error('Product archive failed:', error);
    sendJson(response, error.status || 400, { success: false, message: error.message || 'Unable to archive the product.' });
  }
}
