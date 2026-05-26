import React from 'react';
import { FiInstagram, FiPhone, FiClock, FiGlobe } from 'react-icons/fi';

const MainFooter = () => (
  <footer className="bg-slate-950 text-slate-200 py-16">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 grid gap-8 md:grid-cols-3">
      <div>
        <h2 className="text-2xl font-serif text-white mb-4">Cianelle_Luxe Fragrances</h2>
        <p className="text-sm leading-7 text-slate-400">A premium fragrance experience crafted for luxury lovers. Browse body sprays, perfume oils, long lasting sprays, and elegant scents.</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Connect with Us</h3>
        <ul className="space-y-3 text-sm text-slate-400">
          <li className="flex items-center gap-3"><FiPhone className="w-4 h-4 text-amber-300" /> WhatsApp: <span className="text-white">0247283407</span></li>
          <li className="flex items-center gap-3"><FiInstagram className="w-4 h-4 text-amber-300" /> Instagram: <span className="text-white">Sheis_cianelle</span></li>
          <li className="flex items-center gap-3"><FiGlobe className="w-4 h-4 text-amber-300" /> Snapchat: <span className="text-white">christel_dior</span></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Opening Hours</h3>
        <div className="space-y-3 text-sm text-slate-400">
          <p className="flex items-center gap-3"><FiClock className="w-4 h-4 text-amber-300" /> Monday – Saturday: 8:00am GMT – 6:00pm</p>
          <p className="flex items-center gap-3"><FiClock className="w-4 h-4 text-amber-300" /> Sunday: 12:00pm GMT – 6:00pm</p>
        </div>
      </div>
    </div>
    <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} Cianelle_Luxe Fragrances. All rights reserved.</div>
  </footer>
);

export default MainFooter;
