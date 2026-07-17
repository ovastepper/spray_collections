import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import heroImage from '../assets/landing/elegant-perfume.jpg';

const HeroCarousel = () => (
  <section className="relative isolate overflow-hidden bg-[#171b28] text-white">
    <div className="content-shell grid min-h-[680px] items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-20 lg:min-h-[720px]">
      <div className="relative z-10 max-w-2xl py-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-amber-300 sm:text-xs">Fragrance, made personal</p>
        <h1 className="mt-5 font-serif text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">Leave an impression that lingers.</h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">Expressive fragrances chosen for quiet confidence, unforgettable evenings, and every version of you.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/menu" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-300 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950 hover:bg-white">
            Shop the collection <FiArrowUpRight />
          </Link>
          <Link to="/about" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:border-white hover:bg-white hover:text-slate-950">Our story</Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          <span>Curated in Ghana</span>
          <span>Personal guidance</span>
          <span>Freshly selected</span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xl md:justify-self-end">
        <div className="absolute -inset-8 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative h-[300px] overflow-hidden rounded-[32px] border border-white/10 bg-stone-200 shadow-2xl shadow-black/30 md:h-auto md:aspect-[4/5] md:rounded-[40px]">
          <img className="h-full w-full object-cover" src={heroImage} alt="An elegant gold-accented perfume bottle" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-white/5" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-slate-950/65 p-4 backdrop-blur-md sm:inset-x-7 sm:bottom-7">
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-amber-300">Cianelle selection</p>
            <p className="mt-2 font-serif text-xl">Confidence, bottled.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroCarousel;
