import React from 'react';
import HeroCarousel from '../Components/HeroCarousel';
import CategoryHighlights from '../Components/CategoryHighlights';
import FeaturedProducts from '../Components/FeaturedProducts';
import MainFooter from '../Components/MainFooter';

const Home = () => (
  <div className="bg-[#fcfcfc] text-slate-950">
    <HeroCarousel />
    <CategoryHighlights />
    <FeaturedProducts />
    <section className="max-w-7xl mx-auto px-4 py-16 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-400">Why choose Cianelle_Luxe</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-serif font-semibold text-slate-950">Luxury fragrances built for modern elegance.</h2>
          <p className="mt-6 text-base leading-8 text-slate-600">Our homepage features a premium hero carousel using every category image, category discovery sections, and a curated collection view that represents the full product range.</p>
          <ul className="mt-8 space-y-4 text-slate-600">
            <li>- Premium styling inspired by luxury fragrance brands.</li>
            <li>- Mobile-responsive layout with clear category navigation.</li>
            <li>- Product-driven carousel and collection discovery experience.</li>
          </ul>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <h3 className="text-xl font-serif font-semibold text-slate-950">Landing Page Highlights</h3>
          <div className="mt-6 space-y-4 text-slate-600">
            <div>
              <p className="font-semibold text-slate-950">Hero carousel</p>
              <p>All category images are included in the home page carousel with direct discovery to the full collection.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Category navigation</p>
              <p>Explore body sprays, perfume oils, long lasting sprays, and normal sprays through a dedicated category section.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Featured products</p>
              <p>Highlighted products with pricing, descriptions, and add-to-cart buttons for immediate purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <MainFooter />
  </div>
);

export default Home;
