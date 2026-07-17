import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as initialProducts, categoryFolders } from '../data/productData';
import { useCart } from '../context/CartContext';
import ProductCard from '../Components/ProductCard';

const CategoryPage = () => {
  const { category } = useParams();
  const { products: contextProducts, addToCart } = useCart();
  const productList = contextProducts.length ? contextProducts : initialProducts;
  const categoryInfo = categoryFolders.find((item) => item.slug === category);
  const filteredProducts = productList.filter((item) => item.slug === category);

  if (!categoryInfo) {
    return (
      <main className="min-h-screen bg-[#f7f6f3] px-4 py-20 text-slate-950 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-600">Collection unavailable</p>
          <h1 className="mt-4 font-serif text-4xl">We could not find that collection.</h1>
          <p className="mt-4 text-sm text-slate-600">Explore the complete fragrance wardrobe instead.</p>
          <Link to="/menu" className="mt-7 inline-flex items-center rounded-full bg-slate-950 px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-amber-300 hover:text-slate-950">Shop all fragrances</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f3] text-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-amber-600 sm:text-xs">Cianelle collection</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">{categoryInfo.name}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{categoryInfo.description}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{filteredProducts.length} fragrances</p>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center sm:p-12">
            <h2 className="font-serif text-2xl">New fragrances are on the way.</h2>
            <p className="mt-3 text-sm text-slate-600">Explore the rest of our collection while we update this edit.</p>
            <Link to="/menu" className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">Shop all fragrances</Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default CategoryPage;
