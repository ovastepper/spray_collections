import React from 'react';
import { categoryFolders } from '../data/productData';
import { Link } from 'react-router-dom';

const CategoryHighlights = () => (
  <section className="bg-slate-950 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 lg:px-8">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Shop by Category</p>
        <h2 className="mt-3 text-3xl md:text-4xl font-serif font-semibold">Explore our signature spray collections</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        {categoryFolders.map((category) => (
          <div key={category.slug} className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-xl shadow-slate-950/10">
            <span className="text-xs uppercase tracking-[0.35em] text-amber-300">{category.name}</span>
            <h3 className="mt-4 text-xl font-serif font-semibold">{category.name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-200">{category.description}</p>
            <Link to={`/categories/${category.slug}`} className="mt-6 inline-flex items-center text-sm font-semibold text-amber-300 hover:text-white">
              Browse {category.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryHighlights;
