import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';

const collectionNotes = {
  'Body Sprays': 'Fresh · effortless · everyday',
  'Perfume Oils': 'Concentrated · intimate · lasting',
  'Long Lasting Sprays': 'Bold · expressive · enduring',
  'Normal Sprays': 'Versatile · polished · easy',
};

const ProductCard = ({ product, onAddToCart }) => {
  const inStock = product.trackInventory === false || Number(product.stock ?? 0) > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    onAddToCart(product);
    toast.success('Item added to your bag', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10">
      <div className="relative aspect-[4/5] flex-shrink-0 overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700 backdrop-blur">{product.category}</span>
        {!inStock && <span className="absolute right-4 top-4 rounded-full bg-slate-950 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">Sold out</span>}
      </div>
      <div className="flex flex-grow flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl leading-tight text-slate-950">{product.name}</h3>
          <span className="shrink-0 text-base font-bold text-slate-950">₵{Number(product.price).toFixed(2)}</span>
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-slate-400">{collectionNotes[product.category] || 'Refined · memorable · yours'}</p>
        <p className="mt-3 line-clamp-2 flex-grow text-sm leading-6 text-slate-600">{product.description}</p>
        <button
          type="button"
          disabled={!product.available || !inStock}
          onClick={handleAddToCart}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-amber-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FiShoppingBag className="h-4 w-4" />
          {!product.available ? 'Unavailable' : inStock ? 'Add to bag' : 'Out of stock'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
