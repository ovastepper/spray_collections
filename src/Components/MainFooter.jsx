import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMessageCircle } from 'react-icons/fi';

const MainFooter = () => (
  <footer className="bg-slate-950 text-slate-300">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-serif text-2xl tracking-[0.14em] text-white">CIANELLE_LUXE</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">Expressive fragrances for every mood, memory, and entrance. Discover your signature with a collection curated in Ghana.</p>
          <div className="mt-6 flex gap-3">
            <a href="https://wa.me/233247283407" target="_blank" rel="noreferrer" aria-label="Chat with Cianelle Luxe on WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white hover:border-amber-300 hover:text-amber-300"><FiMessageCircle /></a>
            <a href="https://instagram.com/Sheis_cianelle" target="_blank" rel="noreferrer" aria-label="Follow Cianelle Luxe on Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white hover:border-amber-300 hover:text-amber-300"><FiInstagram /></a>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-white">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li><Link to="/menu" className="min-h-0 hover:text-amber-300">Shop all</Link></li>
            <li><Link to="/about" className="min-h-0 hover:text-amber-300">Our story</Link></li>
            <li><Link to="/contact" className="min-h-0 hover:text-amber-300">Contact</Link></li>
            <li><Link to="/dashboard" className="min-h-0 hover:text-amber-300">My account</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-white">Visit or message</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
            <p>WhatsApp: <a href="https://wa.me/233247283407" target="_blank" rel="noreferrer" className="min-h-0 text-white hover:text-amber-300">024 728 3407</a></p>
            <p>Monday–Saturday<br />8:00am–6:00pm GMT</p>
            <p>Sunday<br />12:00pm–6:00pm GMT</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Cianelle_Luxe Fragrances. All rights reserved.</p>
        <p>Confidence, bottled.</p>
      </div>
    </div>
  </footer>
);

export default MainFooter;
