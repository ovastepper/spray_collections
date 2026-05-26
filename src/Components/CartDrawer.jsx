import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQty, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-50" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col justify-between p-6">
            <div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-serif text-black font-semibold">Your Cart <span className="text-sm font-sans font-normal text-gray-500">({cartItems.length} items)</span></h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-black focus:outline-none"><FiX className="w-5 h-5" /></button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-24 text-slate-500">No items in the cart yet.</div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border border-gray-100 p-3 rounded-sm">
                      <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-serif font-semibold text-black">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">₵{item.price.toFixed(2)} each</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1 bg-gray-100 rounded-sm hover:bg-gray-200"><FiMinus className="w-3 h-3" /></button>
                          <span className="text-xs font-semibold px-2">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1 bg-gray-100 rounded-sm hover:bg-gray-200"><FiPlus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 hover:text-red-600">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Subtotal:</span>
                <span className="font-serif font-bold text-black">₵{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg border-b border-gray-100 pb-4">
                <span className="text-black font-serif font-semibold">Total Price:</span>
                <span className="font-serif font-black text-black">₵{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={clearCart} className="w-full bg-gray-100 text-slate-950 py-3 uppercase text-xs tracking-widest font-bold hover:bg-gray-200 transition rounded-sm">
                  Clear Cart
                </button>
                <button className="w-full bg-black text-white py-3 uppercase text-xs tracking-widest font-bold hover:bg-amber-400 hover:text-slate-950 transition rounded-sm">
                  Checkout
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
