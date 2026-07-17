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
  const lowStock = product.trackInventory !== false
    && Number(product.stock ?? 0) > 0
    && Number(product.stock) <= Number(product.lowStockThreshold ?? 3);

  const handleAddToCart = () => {
    if (!inStock) return;
    onAddToCart(product);
    toast.success('Item added to your bag', {
      position: 'top-center',
      autoClose: 1800,
      hideProgressBar: true,
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10">
      <div className="relative aspect-[4/5] flex-shrink-0 overflow-hidden bg-slate-100">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-white/90 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-slate-700 shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[9px] sm:tracking-[0.18em]">{product.category}</span>
        {!inStock && <span className="absolute right-4 top-4 rounded-full bg-slate-950 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">Sold out</span>}
      </div>
      <div className="flex flex-grow flex-col p-3 sm:p-5">
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:justify-between sm:gap-4">
          <h3 className="font-serif text-base leading-tight text-slate-950 sm:text-xl">{product.name}</h3>
          <span className="shrink-0 text-sm font-bold text-slate-950 sm:text-base">₵{Number(product.price).toFixed(2)}</span>
        </div>
        <p className="mt-3 flex-grow text-[10px] uppercase tracking-[0.16em] text-slate-400">{collectionNotes[product.category] || 'Refined · memorable · yours'}</p>
        {lowStock && <p className="mt-3 text-xs font-semibold text-amber-700">Only {product.stock} left</p>}
        <button
          type="button"
          disabled={!product.available || !inStock}
          onClick={handleAddToCart}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-slate-950 px-2 py-2.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-amber-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300 sm:mt-5 sm:gap-2 sm:px-5 sm:py-3 sm:text-[11px] sm:tracking-[0.18em]"
        >
          <FiShoppingBag className="h-4 w-4" />
          {!product.available ? 'Unavailable' : inStock ? 'Add to bag' : 'Out of stock'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
