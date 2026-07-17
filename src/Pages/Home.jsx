import React from 'react';
import { FiClock, FiHeart, FiMessageCircle, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import HeroCarousel from '../Components/HeroCarousel';
import CategoryHighlights from '../Components/CategoryHighlights';
import FeaturedProducts from '../Components/FeaturedProducts';
import MainFooter from '../Components/MainFooter';
import editorialImage from '../assets/landing/chanel.jpg';

const assurances = [
  { icon: FiShield, title: 'Chosen with care', text: 'Quality fragrances selected for character, performance, and presence.' },
  { icon: FiClock, title: 'Made to linger', text: 'Options for a light daily refresh or a statement that lasts all day.' },
  { icon: FiMessageCircle, title: 'Personal guidance', text: 'Not sure what suits you? We will help you find your signature scent.' },
  { icon: FiHeart, title: 'A scent for every mood', text: 'Easy favourites, rich oils, and bold fragrances for every occasion.' },
];

const Home = () => (
  <div className="bg-[#f7f6f3] text-slate-950">
    <HeroCarousel />

    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-4 py-6 lg:grid-cols-4 lg:px-8">
        {assurances.map(({ icon: Icon, title }, index) => (
          <div key={title} className={`flex items-center justify-center gap-2 px-3 text-center ${index > 1 ? 'mt-5 border-t border-slate-200 pt-5 lg:mt-0 lg:border-t-0 lg:pt-0' : ''}`}>
            <Icon className="h-4 w-4 shrink-0 text-amber-600" />
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700 sm:text-[10px]">{title}</span>
          </div>
        ))}
      </div>
    </section>

    <CategoryHighlights />
    <FeaturedProducts />

    <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24 lg:px-8">
      <div className="grid overflow-hidden rounded-[32px] bg-white shadow-xl shadow-slate-950/5 lg:grid-cols-2">
        <div className="relative min-h-[420px] lg:min-h-[600px]">
          <img src={editorialImage} alt="Elegant fragrance from the Cianelle Luxe collection" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
        </div>
        <div className="flex items-center p-7 sm:p-12 lg:p-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-amber-600 sm:text-xs">The Cianelle promise</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">Luxury is how a fragrance makes you feel.</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">We believe scent should feel personal—not complicated. Our collection brings together expressive fragrances for quiet confidence, unforgettable evenings, and everything in between.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {assurances.slice(0, 4).map(({ icon: Icon, title, text }) => (
                <div key={title}>
                  <Icon className="h-5 w-5 text-amber-600" />
                  <h3 className="mt-3 text-sm font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
            <Link to="/contact" className="mt-9 inline-flex rounded-full border border-slate-950 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950 hover:bg-slate-950 hover:text-white">Find your fragrance</Link>
          </div>
        </div>
      </div>
    </section>

    <MainFooter />
  </div>
);

export default Home;
