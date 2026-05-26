import React from 'react';
import { products } from '../data/productData';
import { useCart } from '../context/CartContext';
import ProductCard from '../Components/ProductCard';

const Menu = () => {
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-slate-950">
      <section className="max-w-7xl mx-auto px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-400">Our full menu</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-serif font-semibold">Shop every fragrance category.</h1>
          <p className="mt-3 text-sm text-slate-500 max-w-2xl mx-auto">Every picture from every category is displayed below so you can browse the full product selection.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Menu;
