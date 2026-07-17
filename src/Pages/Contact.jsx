import React from 'react';
import { FiInstagram, FiMapPin, FiMessageCircle } from 'react-icons/fi';

const channels = [
  { icon: FiMessageCircle, label: 'WhatsApp', value: '024 728 3407', note: 'Fastest response', href: 'https://wa.me/233247283407' },
  { icon: FiInstagram, label: 'Instagram', value: '@Sheis_cianelle', note: 'New arrivals and inspiration', href: 'https://instagram.com/Sheis_cianelle' },
  { icon: FiMapPin, label: 'Visit us', value: 'Kwadaso, Kumasi', note: 'Monday–Saturday, 8am–6pm', href: null },
];

const Contact = () => (
  <main className="page-shell">
    <section className="content-shell py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">Personal guidance</p>
          <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">Let’s find your next signature scent.</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">Tell us what you already love, the mood you want, or the occasion you are shopping for. We will help narrow the collection.</p>
          <div className="mt-8 rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-300">
            <p className="font-semibold text-white">Not sure where to begin?</p>
            <p className="mt-1">Send us the name of a fragrance you enjoy and your preferred budget.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {channels.map(({ icon: Icon, label, value, note, href }) => {
            const content = (
              <>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800"><Icon className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
                  <span className="mt-1 block font-serif text-2xl text-slate-950">{value}</span>
                  <span className="mt-1 block text-xs text-slate-500">{note}</span>
                </span>
                {href && <span className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">Open</span>}
              </>
            );

            return href ? (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="surface-panel flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg sm:p-6">{content}</a>
            ) : (
              <div key={label} className="surface-panel flex items-center gap-4 p-5 sm:p-6">{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  </main>
);

export default Contact;
