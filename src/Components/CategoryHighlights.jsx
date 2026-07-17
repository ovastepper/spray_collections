import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { categoryFolders, products } from '../data/productData';

const CategoryHighlights = () => {
  const categories = categoryFolders.map((category) => ({
    ...category,
    image: products.find((product) => product.slug === category.slug)?.image,
  }));

  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-amber-300 sm:text-xs">Find your signature</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">A fragrance for every way you want to be remembered.</h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 hover:text-white">Shop all fragrances <FiArrowUpRight /></Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/categories/${category.slug}`}
              className={`group relative min-h-[360px] overflow-hidden rounded-[28px] ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[10px] uppercase tracking-[0.32em] text-amber-300">Collection {String(index + 1).padStart(2, '0')}</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-white">{category.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-300">{category.description}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition group-hover:border-amber-300 group-hover:bg-amber-300 group-hover:text-slate-950"><FiArrowUpRight /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;
