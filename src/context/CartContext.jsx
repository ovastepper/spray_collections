import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products as initialProducts } from '../data/productData';

const CartContext = createContext(null);

const loadStoredItems = (key, fallback = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeEmail = (value) => (value || '').trim().toLowerCase();
const normalizePassword = (value) => (value || '').trim();

const normalizeUsers = (users) => {
  if (!Array.isArray(users)) {
    return [];
  }

  return users.map((user) => ({
    ...user,
    email: normalizeEmail(user.email),
    password: normalizePassword(user.password),
    firstName: (user.firstName || '').trim(),
    middleName: (user.middleName || '').trim(),
    lastName: (user.lastName || '').trim(),
    country: (user.country || '').trim(),
    address: (user.address || '').trim(),
    phone: (user.phone || '').trim(),
  }));
};

const hydrateStoredProducts = (storedProducts, initialProducts) => {
  if (!Array.isArray(storedProducts) || !storedProducts.length) {
    return initialProducts;
  }

  const initialMap = new Map(initialProducts.map((item) => [item.id, item]));
  const allIdsMatch = storedProducts.every((stored) => initialMap.has(stored.id));

  if (!allIdsMatch) {
    return initialProducts;
  }

  return storedProducts.map((stored) => {
    const initial = initialMap.get(stored.id);
    return {
      ...initial,
      ...stored,
      image: initial.image,
    };
  });
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => loadStoredItems('cartItems'));
  const [orderHistory, setOrderHistory] = useState(() => loadStoredItems('orderHistory'));
  const [products, setProducts] = useState(() => hydrateStoredProducts(loadStoredItems('products', initialProducts), initialProducts));
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = loadStoredItems('currentUser', null);
    if (!storedUser) {
      return null;
    }

    return {
      ...storedUser,
      email: normalizeEmail(storedUser.email),
      password: normalizePassword(storedUser.password),
    };
  });
  const [users, setUsers] = useState(() => normalizeUsers(loadStoredItems('users', [])));

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

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

  const removeFromCart = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  };

  const updateQty = (productId, qty) => {
    setCartItems((items) => items.map((item) => (item.id === productId ? { ...item, qty: Math.max(1, qty) } : item)));
  };

  const clearCart = () => setCartItems([]);

  const signup = ({ firstName, middleName, lastName, email, password, country, address, phone }) => {
    const emailLower = normalizeEmail(email);
    const trimmedPassword = normalizePassword(password);

    if (!firstName || !lastName || !emailLower || !trimmedPassword || !country || !address || !phone) {
      return { success: false, message: 'All sign up fields are required.' };
    }

    const normalizedUsers = normalizeUsers(users);
    if (normalizedUsers.some((user) => user.email === emailLower)) {
      return { success: false, message: 'An account already exists for this email.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      email: emailLower,
      password: trimmedPassword,
      country: country.trim(),
      address: address.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => normalizeUsers([...prev, newUser]));
    setCurrentUser(newUser);
    return { success: true, message: 'Account created successfully. You are now signed in.' };
  };

  const login = ({ email, password }) => {
    const emailLower = normalizeEmail(email);
    const trimmedPassword = normalizePassword(password);

    if (!emailLower || !trimmedPassword) {
      return { success: false, message: 'Email and password are required.' };
    }

    const normalizedUsers = normalizeUsers(users);
    const existingUser = normalizedUsers.find((user) => user.email === emailLower);
    if (!existingUser || existingUser.password !== trimmedPassword) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const signedInUser = {
      ...existingUser,
      email: emailLower,
      password: trimmedPassword,
    };

    setUsers(normalizedUsers);
    setCurrentUser(signedInUser);
    return { success: true, message: 'Successfully signed in.' };
  };

  const logout = () => setCurrentUser(null);

  const submitOrder = ({ items, total, customer = 'Guest' }) => {
    if (!items.length) return;
    const orderId = `ORD-${Date.now()}`;
    const newOrder = {
      id: orderId,
      customer,
      total,
      date: new Date().toLocaleDateString('en-GB'),
      status: 'Pending',
      items
    };
    setOrderHistory((prev) => [newOrder, ...prev]);
    clearCart();
  };

  const updateProduct = (id, changes) => {
    setProducts((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const addProduct = (product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProductById = (productId) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearOrderHistory = () => setOrderHistory([]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrderHistory((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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
      users,
      signup,
      login,
      logout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
