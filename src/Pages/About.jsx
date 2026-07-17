import React from 'react';
import { FiHeart, FiStar, FiUsers } from 'react-icons/fi';
import storyImage from '../assets/landing/chanel.jpg';

const About = () => (
  <main className="min-h-screen bg-[#f7f6f3] text-slate-950">
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid overflow-hidden rounded-[32px] bg-slate-950 text-white lg:grid-cols-2">
        <div className="flex items-center p-8 sm:p-12 lg:p-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-amber-300 sm:text-xs">Our story</p>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">Fragrance for the moments that become memories.</h1>
            <p className="mt-6 text-sm leading-7 text-slate-300 sm:text-base">Cianelle_Luxe was created for people who see fragrance as more than a finishing touch. It is a mood, a memory, and a quiet form of self-expression.</p>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">We curate approachable luxury—from light everyday sprays to rich perfume oils and unforgettable evening scents—so finding something that feels personal is beautifully simple.</p>
          </div>
        </div>
        <div className="relative min-h-[460px]">
          <img src={storyImage} alt="A fragrance from the Cianelle Luxe collection" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
        </div>
      </div>

      <div className="grid gap-5 py-12 sm:grid-cols-3 sm:py-16">
        {[
          { icon: FiStar, title: 'Curated quality', text: 'Each fragrance is selected for its character, performance, and ability to make an impression.' },
          { icon: FiUsers, title: 'Personal service', text: 'We make fragrance discovery welcoming, whether you know your notes or are choosing your first signature.' },
          { icon: FiHeart, title: 'Everyday luxury', text: 'Beautiful scent should be part of everyday life, with options for every mood, moment, and budget.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-[28px] border border-slate-200 bg-white p-7">
            <Icon className="h-6 w-6 text-amber-600" />
            <h2 className="mt-5 font-serif text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default About;
