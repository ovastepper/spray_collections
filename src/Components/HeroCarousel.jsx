import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { products } from '../data/productData';

const HeroCarousel = () => (
  <section className="relative overflow-hidden bg-slate-950">
    <Carousel fade interval={4200} controls indicators className="landing-carousel">
      {products.map((item) => (
        <Carousel.Item key={item.id} className="relative min-h-[68vh]">
          <div className="absolute inset-0 bg-black/40" />
          <img className="w-full h-[68vh] object-cover" src={item.image} alt={item.name} />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="relative z-10 max-w-3xl text-center text-white">
              <span className="text-xs uppercase tracking-[0.35em] text-amber-300 mb-4 block">{item.category}</span>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight mb-6">{item.name}</h1>
              <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto mb-8">{item.description}</p>
              <Link to="/menu" className="inline-flex items-center justify-center bg-amber-300 text-slate-950 px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-sm shadow-lg hover:bg-white transition">
                Discover Collection
              </Link>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  </section>
);

export default HeroCarousel;
