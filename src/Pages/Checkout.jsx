import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiLock, FiMapPin } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import AuthModal from '../Components/AuthModal';

const Checkout = () => {
  const { cartItems, totalPrice, submitOrder, currentUser } = useCart();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    setIsSubmitting(true);
    setOrderError('');
    const result = await submitOrder({ items: cartItems });
    setIsSubmitting(false);
    if (result.success) navigate('/dashboard');
    else setOrderError(result.message);
  };

  if (cartItems.length === 0) {
    return (
      <main className="page-shell py-20">
        <div className="content-shell">
          <div className="surface-panel mx-auto max-w-xl p-8 text-center sm:p-12">
            <p className="eyebrow">Your bag</p>
            <h1 className="mt-4 font-serif text-3xl">Your bag is waiting for a fragrance.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">Explore the collection, then return here when you are ready.</p>
            <Link to="/menu" className="primary-button mt-7 gap-2"><FiArrowLeft /> Continue shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="content-shell">
        <button type="button" onClick={() => navigate(-1)} className="mb-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 hover:text-slate-950"><FiArrowLeft /> Back to shopping</button>

        <div className="mb-9 max-w-2xl">
          <p className="eyebrow">Secure checkout</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Review your order.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">Confirm your fragrances and delivery details before placing the order.</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-5">
            <section className="surface-panel overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="font-serif text-xl">Your fragrances</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-5 sm:p-6">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-24">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-lg text-slate-950">{item.name}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{item.category}</p>
                        </div>
                        <p className="shrink-0 font-bold text-slate-950">₵{(item.price * item.qty).toFixed(2)}</p>
                      </div>
                      <p className="mt-4 text-sm text-slate-500">Quantity {item.qty} · ₵{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-panel p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800"><FiMapPin /></span>
                <div>
                  <h2 className="font-serif text-xl">Delivery details</h2>
                  {currentUser ? (
                    <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
                      <p className="font-semibold text-slate-950">{currentUser.firstName} {currentUser.lastName}</p>
                      <p>{currentUser.address || 'No delivery address saved'}</p>
                      <p>{currentUser.phone || currentUser.email}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-500">Sign in or create an account to provide your delivery details and track this order.</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          <aside className="surface-panel p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl">Order summary</h2>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-slate-600"><span>{cartItems.reduce((sum, item) => sum + item.qty, 0)} items</span><span>₵{totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Delivery</span><span className="font-semibold text-emerald-700">Free</span></div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-end justify-between">
                  <span className="font-semibold text-slate-950">Total</span>
                  <span className="font-serif text-2xl font-semibold text-slate-950">₵{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!currentUser && (
              <button type="button" onClick={() => setIsAuthOpen(true)} className="secondary-button mt-6 w-full">Sign in or create account</button>
            )}
            <button type="button" onClick={handleConfirm} disabled={isSubmitting} className="primary-button mt-3 w-full gap-2">
              {isSubmitting ? 'Placing order…' : <><FiCheck /> Place order</>}
            </button>
            {orderError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{orderError}</p>}
            <p className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400"><FiLock /> Secure account-protected ordering</p>
          </aside>
        </div>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode="signin" onSuccess={() => setIsAuthOpen(false)} />
    </main>
  );
};

export default Checkout;
