import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const missingKeys = Object.entries(requiredConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length) {
  throw new Error(`Missing Firebase environment variables: ${missingKeys.join(', ')}`);
}

const app = initializeApp({
  ...requiredConfig,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});

export const auth = getAuth(app);
export const db = getFirestore(app);

const configuredAdminUids = [
  import.meta.env.VITE_FIREBASE_ADMIN_UIDS,
  import.meta.env.VITE_FIREBASE_ADMIN_UID
]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((uid) => uid.trim())
  .filter(Boolean);

export const adminUids = [...new Set(configuredAdminUids)];
