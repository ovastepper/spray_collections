import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, categoryFolders } from '../data/productData';
import { useCart } from '../context/CartContext';
import ProductCard from '../Components/ProductCard';

const CategoryPage = () => {
  const { category } = useParams();
  const categoryInfo = categoryFolders.find((item) => item.slug === category);
  const filteredProducts = products.filter((item) => item.slug === category);

  if (!categoryInfo) {
    return (
      <main className="min-h-screen bg-[#fcfcfc] text-slate-950 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-semibold">Category not found</h1>
          <p className="mt-3 text-slate-600">Please choose one of our collections from the navigation menu.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-amber-400">Return Home</Link>
        </div>
      </main>
    );
  }

  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-slate-950">
      <section className="max-w-7xl mx-auto px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-400">{categoryInfo.name}</p>
          <h1 className="mt-3 text-4xl font-serif font-semibold">{categoryInfo.name} Collection</h1>
          <p className="mt-3 text-sm text-slate-500 max-w-2xl mx-auto">{categoryInfo.description}</p>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] bg-white p-12 text-center shadow-sm border border-slate-200">
            <h2 className="text-2xl font-serif font-semibold">No products found</h2>
            <p className="mt-3 text-slate-600">We are updating this collection. Please explore other categories or check back soon.</p>
            <Link to="/menu" className="mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-amber-400">Browse All Products</Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default CategoryPage;
