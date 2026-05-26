import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

const ProductCard = ({ product, onAddToCart }) => (
  <article className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 duration-200">
    <div className="h-72 overflow-hidden rounded-3xl bg-slate-100">
      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
    </div>
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.35em] text-amber-400">{product.category}</span>
        <span className="text-lg font-semibold text-slate-950">₵{product.price.toFixed(2)}</span>
      </div>
      <h3 className="mt-4 text-xl font-serif font-semibold text-slate-950">{product.name}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
      <button
        disabled={!product.available}
        onClick={() => onAddToCart(product)}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <FiShoppingBag className="w-4 h-4" />
        {product.available ? 'Add To Cart' : 'Unavailable'}
      </button>
    </div>
  </article>
);

export default ProductCard;
