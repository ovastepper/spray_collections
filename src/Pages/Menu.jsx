import React from 'react';
import { products as initialProducts } from '../data/productData';
import { useCart } from '../context/CartContext';
import ProductCard from '../Components/ProductCard';

const Menu = () => {
  const { addToCart, products: contextProducts } = useCart();
  const menuProducts = contextProducts.length ? contextProducts : initialProducts;

  return (
    <main className="min-h-screen bg-[#f7f6f3] text-slate-950">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.38em] text-amber-600 font-bold">The fragrance wardrobe</p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight">Find the scent that feels like you.</h1>
          <p className="mt-5 text-sm sm:text-base leading-7 text-slate-600">Explore refreshing body sprays, concentrated perfume oils, enduring signatures, and effortless everyday favourites.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menuProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Menu;
