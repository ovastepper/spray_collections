import React from 'react';
import { featuredProducts as staticFeaturedProducts } from '../data/productData';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const { addToCart, products: contextProducts } = useCart();
  const featuredProducts = contextProducts.length ? contextProducts.slice(0, 12) : staticFeaturedProducts;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.38em] text-amber-500 font-semibold">The Cianelle edit</p>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-950">Scents worth reaching for.</h2>
        <p className="mt-4 text-sm leading-6 text-slate-500 max-w-xl mx-auto px-2">A curated selection of customer favourites, from intimate perfume oils to statement-making sprays.</p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
