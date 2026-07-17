import React, { useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch, FiSliders } from 'react-icons/fi';
import { products as initialProducts, categoryFolders } from '../data/productData';
import { useCart } from '../context/CartContext';
import ProductCard from '../Components/ProductCard';

const PAGE_SIZE = 12;

const Menu = () => {
  const { addToCart, products: contextProducts } = useCart();
  const menuProducts = contextProducts.length ? contextProducts : initialProducts;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const next = menuProducts.filter((product) => {
      const categoryMatch = category === 'all' || product.slug === category;
      const queryMatch = !normalizedQuery || [product.name, product.category, product.description]
        .some((value) => String(value || '').toLowerCase().includes(normalizedQuery));
      return categoryMatch && queryMatch;
    });

    return [...next].sort((a, b) => {
      if (sort === 'price-low') return Number(a.price) - Number(b.price);
      if (sort === 'price-high') return Number(b.price) - Number(a.price);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return (a.sortIndex ?? 9999) - (b.sortIndex ?? 9999);
    });
  }, [category, menuProducts, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visibleProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main className="page-shell">
      <section className="border-b border-slate-200 bg-white">
        <div className="content-shell py-12 sm:py-16">
          <p className="eyebrow">The fragrance wardrobe</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">Find the scent that feels like you.</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-600 lg:justify-self-end">Explore refreshing sprays, concentrated oils, enduring signatures, and effortless everyday favourites.</p>
          </div>
        </div>
      </section>

      <section className="content-shell py-8 sm:py-12">
        <div className="surface-panel p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <span className="sr-only">Search fragrances</span>
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setPage(1); }}
                placeholder="Search by fragrance or collection"
                className="field-control pl-11"
              />
            </label>
            <label className="flex items-center gap-2">
              <FiSliders className="hidden text-slate-400 sm:block" />
              <span className="sr-only">Sort products</span>
              <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="field-control min-w-52">
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter by collection">
            {[{ slug: 'all', name: 'All fragrances' }, ...categoryFolders].map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => { setCategory(item.slug); setPage(1); }}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${category === item.slug ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">{filteredProducts.length} fragrances</p>
            <p className="mt-1 text-xs text-slate-500">Showing page {safePage} of {pageCount}</p>
          </div>
          {(query || category !== 'all') && (
            <button type="button" onClick={() => { setQuery(''); setCategory('all'); }} className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700 hover:text-slate-950">Clear filters</button>
          )}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="surface-panel py-20 text-center">
            <h2 className="font-serif text-2xl">No fragrances matched your search.</h2>
            <p className="mt-2 text-sm text-slate-500">Try a different name or browse every collection.</p>
          </div>
        )}

        {pageCount > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Product pages">
            <button type="button" disabled={safePage === 1} onClick={() => setPage((value) => value - 1)} className="secondary-button gap-2 px-4"><FiChevronLeft /> Previous</button>
            <span className="text-xs font-semibold text-slate-500">{safePage} / {pageCount}</span>
            <button type="button" disabled={safePage === pageCount} onClick={() => setPage((value) => value + 1)} className="secondary-button gap-2 px-4">Next <FiChevronRight /></button>
          </nav>
        )}
      </section>
    </main>
  );
};

export default Menu;
