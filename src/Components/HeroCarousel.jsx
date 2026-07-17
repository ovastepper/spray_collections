import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { heroSlides } from '../data/productData';

const HeroCarousel = () => (
  <section className="relative overflow-hidden bg-slate-950">
    <Carousel fade interval={5200} controls={false} indicators className="landing-carousel">
      {heroSlides.map((item, index) => (
        <Carousel.Item key={item.id} className="relative h-[68vh] min-h-[520px] max-h-[760px]">
          <img className="h-full w-full object-cover" src={item.image} alt={item.name} loading={index === 0 ? 'eager' : 'lazy'} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="max-w-2xl text-left text-white">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.38em] text-amber-300 sm:text-xs">Fragrance, made personal</p>
                <h1 className="font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-7xl">Leave an impression that lingers.</h1>
                <p className="mt-6 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">Discover expressive fragrances chosen for every mood, every entrance, and every version of you.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/menu" className="inline-flex items-center justify-center rounded-full bg-amber-300 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950 hover:bg-white">Shop the collection</Link>
                  <Link to="/about" className="inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:border-white hover:bg-white hover:text-slate-950">Our story</Link>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
    <div className="absolute bottom-8 right-5 z-10 hidden text-right text-white/70 sm:block lg:right-12">
      <p className="text-[10px] uppercase tracking-[0.3em]">Curated in Ghana</p>
      <p className="mt-1 font-serif text-sm text-white">Confidence, bottled.</p>
    </div>
  </section>
);

export default HeroCarousel;
