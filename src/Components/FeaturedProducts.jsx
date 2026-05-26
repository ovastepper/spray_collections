import React from 'react';
import { featuredProducts } from '../data/productData';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const { addToCart } = useCart();

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 lg:px-8">
      <div className="text-center mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-400 font-semibold">Featured Collection</p>
        <h2 className="mt-3 text-3xl md:text-4xl font-serif font-semibold text-slate-950">Mixed products from all four categories</h2>
        <p className="mt-3 text-sm text-slate-500 max-w-2xl mx-auto">A carefully curated selection from body sprays, oils, and long-lasting premium fragrances.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
