import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductCard = ({ product, onAddToCart }) => {
  const inStock = product.trackInventory === false || Number(product.stock ?? 0) > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    onAddToCart(product);
    toast.success('✓ Item added to cart successfully!', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <article className="rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 duration-200 overflow-hidden flex flex-col h-full">
      <div className="aspect-square overflow-hidden rounded-3xl bg-slate-100 flex-shrink-0">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] uppercase tracking-[0.35em] text-amber-400">{product.category}</span>
          <span className="text-lg font-semibold text-slate-950">₵{product.price.toFixed(2)}</span>
        </div>
        <h3 className="mt-4 text-xl font-serif font-semibold text-slate-950">{product.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600 flex-grow">{product.description}</p>
        <button
          disabled={!product.available || !inStock}
          onClick={handleAddToCart}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300 flex-shrink-0"
        >
          <FiShoppingBag className="w-4 h-4" />
          {!product.available ? 'Unavailable' : inStock ? 'Add To Cart' : 'Out of stock'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
