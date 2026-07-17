import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import Navbar from './Components/Navbar';
import CartDrawer from './Components/CartDrawer';
import Home from './Pages/Home';

const About = lazy(() => import('./Pages/About'));
const Menu = lazy(() => import('./Pages/Menu'));
const Contact = lazy(() => import('./Pages/Contact'));
const CategoryPage = lazy(() => import('./Pages/CategoryPage'));
const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'));
const Checkout = lazy(() => import('./Pages/Checkout'));
const UserDashboard = lazy(() => import('./Pages/UserDashboard'));

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <Router>
        <div className="relative">
          <ToastContainer
            position="top-center"
            autoClose={1800}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Navbar onOpenCart={() => setIsCartOpen(true)} />
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

          <Suspense fallback={<div className="min-h-[60vh] bg-[#f7f4ee] p-12 text-center text-sm text-slate-500">Loading Cianelle…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/categories/:category" element={<CategoryPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
