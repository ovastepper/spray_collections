import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { featuredProducts as staticFeaturedProducts } from '../data/productData';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const { addToCart, products: contextProducts } = useCart();
  const featuredProducts = contextProducts.length
    ? contextProducts.slice(0, 4)
    : staticFeaturedProducts.slice(0, 4);

  return (
    <section className="content-shell py-14 sm:py-20">
      <div className="mb-8 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">The Cianelle edit</p>
          <h2 className="mt-3 font-serif text-3xl text-slate-950 sm:text-4xl lg:text-5xl">Scents worth reaching for.</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">A concise edit of customer favourites, from intimate perfume oils to statement-making sprays.</p>
        </div>
        <Link to="/menu" className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 hover:text-amber-700">View all fragrances <FiArrowRight /></Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
