import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiMenu, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';
import { categoryFolders } from '../data/productData';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';

const Navbar = ({ onOpenCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { totalItems, currentUser } = useCart();
  const navClass = 'flex min-h-11 items-center px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:text-amber-600';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Cianelle Luxe home">
            <img src="/cianelle.svg.jpeg" alt="" className="h-11 w-11 rounded-full object-contain" />
            <span className="hidden font-serif text-base tracking-[0.22em] text-slate-950 sm:block">CIANELLE_LUXE</span>
          </Link>

          <div className="hidden items-center md:flex">
            <Link to="/menu" className={navClass}>Shop</Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((open) => !open)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 180)}
                className={`${navClass} gap-1.5`}
                aria-expanded={isDropdownOpen}
              >
                Categories <FiChevronDown className={`h-3.5 w-3.5 transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-1/2 top-full w-60 -translate-x-1/2 border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-950/10">
                  {categoryFolders.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/categories/${category.slug}`}
                      className="block min-h-0 px-4 py-3 text-sm text-slate-700 transition hover:bg-amber-50 hover:text-slate-950"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/about" className={navClass}>Our Story</Link>
            <Link to="/contact" className={navClass}>Contact</Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {currentUser ? (
              <Link to="/dashboard" className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-950" aria-label="My account">
                <FiUser className="h-5 w-5" />
              </Link>
            ) : (
              <button type="button" onClick={() => setIsAuthOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-950" aria-label="Sign in">
                <FiUser className="h-5 w-5" />
              </button>
            )}
            <button type="button" onClick={onOpenCart} className="relative flex h-11 w-11 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-950" aria-label={`Shopping bag with ${totalItems} items`}>
              <FiShoppingBag className="h-5 w-5" />
              {totalItems > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold text-slate-950">{totalItems}</span>}
            </button>
            <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-full text-slate-800 md:hidden" aria-label="Toggle navigation" aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 pb-6 pt-3 shadow-xl md:hidden">
          <Link to="/menu" onClick={closeMobileMenu} className="block border-b border-slate-100 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">Shop all</Link>
          <button type="button" onClick={() => setIsMobileCategoriesOpen((open) => !open)} className="flex w-full items-center justify-between border-b border-slate-100 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            Categories <FiChevronDown className={`transition ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
          </button>
          {isMobileCategoriesOpen && (
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
              {categoryFolders.map((category) => (
                <Link key={category.slug} to={`/categories/${category.slug}`} onClick={closeMobileMenu} className="block min-h-0 py-3 text-sm text-slate-600">{category.name}</Link>
              ))}
            </div>
          )}
          <Link to="/about" onClick={closeMobileMenu} className="block border-b border-slate-100 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">Our Story</Link>
          <Link to="/contact" onClick={closeMobileMenu} className="block py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">Contact</Link>
          {!currentUser && (
            <button type="button" onClick={() => { setIsAuthOpen(true); closeMobileMenu(); }} className="mt-4 w-full rounded-full bg-slate-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white">Sign in or create account</button>
          )}
        </div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode="signin" />
    </nav>
  );
};

export default Navbar;
