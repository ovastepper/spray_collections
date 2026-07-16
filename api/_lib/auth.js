import { adminAuth, configuredAdminUid } from './firebaseAdmin.js';

const getBearerToken = (request) => {
  const header = request.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
};

export const requireUser = async (request) => {
  const token = getBearerToken(request);
  if (!token) {
    const error = new Error('Sign in before continuing.');
    error.status = 401;
    throw error;
  }

  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    const error = new Error('Your session is invalid or expired. Please sign in again.');
    error.status = 401;
    throw error;
  }
};

export const requireAdmin = async (request) => {
  const user = await requireUser(request);
  if (!configuredAdminUid || user.uid !== configuredAdminUid) {
    const error = new Error('Administrator access is required.');
    error.status = 403;
    throw error;
  }
  return user;
};
