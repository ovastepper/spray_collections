import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import { products as initialProducts } from '../data/productData';
import { adminUid, auth, db } from '../config/firebase';

const CartContext = createContext(null);

const defaultCompanyInfo = {
  name: 'Cianelle_Luxe Fragrances',
  phone: '0247283407',
  email: 'info@cianelle.com',
  address: 'Kwadaso-Kumasi',
  days: 'Monday – Saturday',
  times: '8:00am GMT – 6:00pm'
};

const localProductsById = new Map(initialProducts.map((product) => [product.id, product]));

const loadStoredCart = () => {
  try {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const firebaseMessage = (error, fallback) => {
  const messages = {
    'auth/email-already-in-use': 'An account already exists for this email.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Please choose a stronger password.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.'
  };
  return messages[error?.code] || fallback;
};

const toOrder = (snapshot) => {
  const data = snapshot.data();
  return {
    ...data,
    id: snapshot.id,
    date: data.date || data.createdAt?.toDate?.().toLocaleDateString('en-GB') || ''
  };
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadStoredCart);
  const [orderHistory, setOrderHistory] = useState([]);
  const [products, setProducts] = useState(initialProducts);
  const [currentUser, setCurrentUser] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(defaultCompanyInfo);
  const [authReady, setAuthReady] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [seedStatus, setSeedStatus] = useState('idle');

  const isAdmin = currentUser?.uid === adminUid;

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      setCurrentUser(null);
      setOrderHistory([]);
      setAuthReady(true);
      return;
    }

    try {
      const profileSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
      const profile = profileSnapshot.exists() ? profileSnapshot.data() : {};
      setCurrentUser({
        ...profile,
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: profile.firstName || firebaseUser.email?.split('@')[0] || 'User',
        lastName: profile.lastName || ''
      });
    } catch {
      setCurrentUser({
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firebaseUser.email?.split('@')[0] || 'User',
        lastName: ''
      });
    } finally {
      setAuthReady(true);
    }
  }), []);

  useEffect(() => onSnapshot(collection(db, 'products'), (snapshot) => {
    if (snapshot.empty) {
      setProducts(initialProducts);
      return;
    }

    const nextProducts = snapshot.docs
      .map((productDoc) => {
        const data = productDoc.data();
        return {
          ...localProductsById.get(productDoc.id),
          ...data,
          id: productDoc.id,
          image: localProductsById.get(productDoc.id)?.image || data.image || ''
        };
      })
      .sort((a, b) => (a.sortIndex ?? 9999) - (b.sortIndex ?? 9999));
    setProducts(nextProducts);
    setBackendError('');
  }, () => setBackendError('Unable to load the product catalogue from Firebase.')), []);

  useEffect(() => onSnapshot(doc(db, 'settings', 'company'), (snapshot) => {
    if (snapshot.exists()) {
      setCompanyInfo({ ...defaultCompanyInfo, ...snapshot.data() });
    }
  }, () => setBackendError('Unable to load company settings from Firebase.')), []);

  useEffect(() => {
    if (!currentUser) return undefined;

    const ordersRef = collection(db, 'orders');
    const ordersQuery = isAdmin ? ordersRef : query(ordersRef, where('userId', '==', currentUser.uid));
    return onSnapshot(ordersQuery, (snapshot) => {
      const nextOrders = snapshot.docs.map(toOrder).sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
      setOrderHistory(nextOrders);
      setBackendError('');
    }, () => setBackendError('Unable to load orders from Firebase.'));
  }, [currentUser, isAdmin]);

  useEffect(() => {
    if (!isAdmin || seedStatus !== 'idle') return;

    const seedInitialData = async () => {
      setSeedStatus('running');
      try {
        const seedRef = doc(db, 'meta', 'catalog-v1');
        const seedSnapshot = await getDoc(seedRef);
        if (!seedSnapshot.exists()) {
          for (let start = 0; start < initialProducts.length; start += 400) {
            const batch = writeBatch(db);
            initialProducts.slice(start, start + 400).forEach((product, offset) => {
              const metadata = { ...product };
              delete metadata.image;
              batch.set(doc(db, 'products', product.id), {
                ...metadata,
                sortIndex: start + offset
              });
            });
            await batch.commit();
          }

          await setDoc(doc(db, 'settings', 'company'), defaultCompanyInfo, { merge: true });
          await setDoc(seedRef, { seededAt: serverTimestamp(), productCount: initialProducts.length });
        }
        setSeedStatus('complete');
      } catch (error) {
        console.error('Firebase seed failed:', error);
        setBackendError('The initial Firebase catalogue seed failed. Check Firestore rules and try signing in again.');
        setSeedStatus('failed');
      }
    };

    seedInitialData();
  }, [isAdmin, seedStatus]);

  const addToCart = (product) => {
    setCartItems((items) => {
      const itemId = product.id || `item-${Date.now()}`;
      const existing = items.find((item) => item.id === itemId);
      if (existing) {
        return items.map((item) => (item.id === itemId ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...items, { ...product, id: itemId, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => setCartItems((items) => items.filter((item) => item.id !== productId));

  const updateQty = (productId, qty) => {
    setCartItems((items) => items.map((item) => (item.id === productId ? { ...item, qty: Math.max(1, qty) } : item)));
  };

  const clearCart = () => setCartItems([]);

  const signup = async ({ firstName, middleName, lastName, email, password, country, address, phone }) => {
    const emailLower = email.trim().toLowerCase();
    if (!firstName || !lastName || !emailLower || !password || !country || !address || !phone) {
      return { success: false, message: 'All required sign-up fields must be completed.' };
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, emailLower, password);
      const profile = {
        uid: credential.user.uid,
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        email: emailLower,
        country: country.trim(),
        address: address.trim(),
        phone: phone.trim(),
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', credential.user.uid), profile);
      setCurrentUser({ ...profile, id: credential.user.uid, createdAt: new Date() });
      return { success: true, message: 'Account created successfully. You are now signed in.' };
    } catch (error) {
      return { success: false, message: firebaseMessage(error, 'Unable to create the account. Please try again.') };
    }
  };

  const login = async ({ email, password }) => {
    const emailLower = email.trim().toLowerCase();
    if (!emailLower || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    try {
      await signInWithEmailAndPassword(auth, emailLower, password);
      return { success: true, message: 'Successfully signed in.' };
    } catch (error) {
      return { success: false, message: firebaseMessage(error, 'Unable to sign in. Please try again.') };
    }
  };

  const logout = async () => signOut(auth);

  const submitOrder = async ({ items, total, customer = 'Guest' }) => {
    if (!items.length || !currentUser) {
      return { success: false, message: 'Sign in and add items before placing an order.' };
    }

    try {
      const orderId = `ORD-${Date.now()}`;
      await setDoc(doc(db, 'orders', orderId), {
        userId: currentUser.uid,
        customer,
        customerEmail: currentUser.email,
        total,
        date: new Date().toLocaleDateString('en-GB'),
        status: 'Pending',
        createdAt: serverTimestamp(),
        items: items.map(({ id, name, price, qty, category }) => ({ id, name, price, qty, category: category || '' }))
      });
      clearCart();
      return { success: true, orderId };
    } catch {
      return { success: false, message: 'Unable to save your order. Please try again.' };
    }
  };

  const updateProduct = async (id, changes) => updateDoc(doc(db, 'products', id), changes);

  const addProduct = async (product) => {
    const metadata = { ...product };
    delete metadata.image;
    await setDoc(doc(db, 'products', product.id), metadata);
  };

  const deleteProductById = async (productId) => deleteDoc(doc(db, 'products', productId));

  const clearOrderHistory = async () => {
    if (!isAdmin) return;
    const snapshot = await getDocs(collection(db, 'orders'));
    for (let start = 0; start < snapshot.docs.length; start += 400) {
      const batch = writeBatch(db);
      snapshot.docs.slice(start, start + 400).forEach((orderDoc) => batch.delete(orderDoc.ref));
      await batch.commit();
    }
  };

  const updateOrderStatus = async (orderId, status) => updateDoc(doc(db, 'orders', orderId), { status });

  const updateCompanyInfo = async (nextCompanyInfo) => {
    await setDoc(doc(db, 'settings', 'company'), nextCompanyInfo, { merge: true });
  };

  const totalItems = useMemo(() => cartItems.reduce((count, item) => count + item.qty, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.qty * item.price, 0), [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItems,
      totalPrice,
      orderHistory,
      submitOrder,
      clearOrderHistory,
      updateOrderStatus,
      products,
      updateProduct,
      addProduct,
      deleteProductById,
      currentUser,
      signup,
      login,
      logout,
      isAdmin,
      authReady,
      companyInfo,
      setCompanyInfo,
      updateCompanyInfo,
      backendError,
      seedStatus
    }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
