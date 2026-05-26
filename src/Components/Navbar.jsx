import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import { categoryFolders } from '../data/productData';
import { useCart } from '../context/CartContext';

const Navbar = ({ onOpenCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D4AF37] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="text-2xl font-serif tracking-widest text-black group">
            CIANELLE_LUXE
            <span className="block text-[9px] font-sans tracking-[0.3em] text-center text-gray-500 group-hover:text-[#D4AF37] transition-colors">FRAGRANCES</span>
          </Link>

          <div className="hidden md:flex space-x-8 font-sans text-sm tracking-wider uppercase font-medium items-center">
            <Link to="/" className="text-black hover:text-[#D4AF37]">Home</Link>
            <Link to="/about" className="text-black hover:text-[#D4AF37]">About</Link>
            <Link to="/menu" className="text-black hover:text-[#D4AF37]">Menu</Link>
            <Link to="/contact" className="text-black hover:text-[#D4AF37]">Contact</Link>
            <Link to="/admin" className="text-[#D4AF37] font-semibold">Dashboard</Link>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="flex items-center text-black hover:text-[#D4AF37] focus:outline-none uppercase"
              >
                Categories <FiChevronDown className="ml-1 text-xs" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-sm py-2 z-50">
                  {categoryFolders.map((cat) => (
                    <Link key={cat.slug} to={`/categories/${cat.slug}`} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] normal-case">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onOpenCart} className="p-2 text-black hover:text-[#D4AF37] relative focus:outline-none">
              <FiShoppingCart className="w-5 h-5" />
              {totalItems > 0 && <span className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems}</span>}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={onOpenCart} className="relative p-2 text-black"><FiShoppingCart className="w-5 h-5" /></button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black p-2 focus:outline-none">
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 uppercase text-sm tracking-wide shadow-inner">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50 text-black">Home</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50 text-black">About</Link>
          <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50 text-black">Menu</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50 text-black">Contact</Link>
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50 text-[#D4AF37]">Dashboard</Link>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[11px] tracking-[0.35em] text-gray-500 mb-2">Categories</p>
            {categoryFolders.map((cat) => (
              <Link key={cat.slug} to={`/categories/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-black hover:text-[#D4AF37] border-b border-gray-50 last:border-b-0">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
