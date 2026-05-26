import React from 'react';

const Contact = () => (
  <main className="min-h-screen bg-[#f8f4ee] text-slate-950">
    <section className="max-w-5xl mx-auto px-4 py-20 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-400">Get in touch</p>
          <h1 className="mt-4 text-4xl font-serif font-semibold">Questions about our fragrances?</h1>
          <p className="mt-4 text-slate-700 leading-8">Reach out via WhatsApp, Instagram, or send a message using the contact details below. Our team is ready to help you find your next signature scent.</p>
        </div>
        <div className="rounded-[32px] bg-white p-10 shadow-xl shadow-slate-900/5 border border-slate-200">
          <div className="space-y-6 text-slate-700">
            <div>
              <h2 className="text-base font-semibold text-slate-950">WhatsApp</h2>
              <p className="text-sm">0247283407</p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-950">Instagram</h2>
              <p className="text-sm">@Sheis_cianelle</p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-950">Snapchat</h2>
              <p className="text-sm">christel_dior</p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-950">Location</h2>
              <p className="text-sm">Kwadaso-Kumasi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default Contact;
