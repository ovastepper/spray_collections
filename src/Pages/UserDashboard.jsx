import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut, FiPackage, FiSearch, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const statusStyles = {
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-700',
  Ready: 'bg-blue-100 text-blue-800',
};

const UserDashboard = () => {
  const { orderHistory, currentUser, authReady, logout } = useCart();
  const [query, setQuery] = useState('');

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return orderHistory;
    return orderHistory.filter((order) => (
      order.id.toLowerCase().includes(normalized)
      || order.items?.some((item) => item.name.toLowerCase().includes(normalized))
    ));
  }, [orderHistory, query]);

  if (!authReady) return <main className="page-shell p-10 text-center text-sm text-slate-500">Loading your account…</main>;

  if (!currentUser) {
    return (
      <main className="page-shell py-20">
        <div className="content-shell">
          <div className="surface-panel mx-auto max-w-xl p-8 text-center sm:p-12">
            <FiPackage className="mx-auto h-9 w-9 text-amber-600" />
            <h1 className="mt-5 font-serif text-3xl">Sign in to see your orders.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">Your order history and live fulfilment updates are protected by your account.</p>
            <Link to="/" className="primary-button mt-7">Return home</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="content-shell">
        <header className="surface-panel overflow-hidden">
          <div className="bg-slate-950 p-6 text-white sm:p-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">Your Cianelle account</p>
                <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Welcome, {currentUser.firstName}.</h1>
                <p className="mt-2 text-sm text-slate-400">{currentUser.email}</p>
              </div>
              <button type="button" onClick={logout} className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] hover:bg-white hover:text-slate-950 sm:self-auto"><FiLogOut /> Sign out</button>
            </div>
          </div>
          <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-5"><p className="text-xs text-slate-500">Orders placed</p><p className="mt-1 font-serif text-2xl">{orderHistory.length}</p></div>
            <div className="p-5"><p className="text-xs text-slate-500">In progress</p><p className="mt-1 font-serif text-2xl">{orderHistory.filter((order) => !['Delivered', 'Cancelled'].includes(order.status)).length}</p></div>
            <div className="p-5"><p className="text-xs text-slate-500">Delivered</p><p className="mt-1 font-serif text-2xl">{orderHistory.filter((order) => order.status === 'Delivered').length}</p></div>
          </div>
        </header>

        <section className="mt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Order history</p>
              <h2 className="mt-2 font-serif text-3xl">Track every purchase.</h2>
            </div>
            <label className="relative block w-full sm:max-w-sm">
              <span className="sr-only">Search orders</span>
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order ID or fragrance" className="field-control pl-11" />
            </label>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="surface-panel mt-6 p-10 text-center">
              <FiShoppingBag className="mx-auto h-8 w-8 text-slate-300" />
              <h3 className="mt-4 font-serif text-2xl">{orderHistory.length ? 'No matching order.' : 'No orders yet.'}</h3>
              <p className="mt-2 text-sm text-slate-500">{orderHistory.length ? 'Try another order ID or fragrance name.' : 'Your first fragrance is waiting in the collection.'}</p>
              {!orderHistory.length && <Link to="/menu" className="primary-button mt-6">Explore fragrances</Link>}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredOrders.map((order) => (
                <article key={order.id} className="surface-panel p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Order {order.id}</p>
                      <p className="mt-2 text-sm text-slate-500">Placed {order.date || 'recently'} · {order.items?.length || 0} products</p>
                    </div>
                    <div className="flex items-center gap-3 sm:text-right">
                      <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${statusStyles[order.status] || 'bg-amber-100 text-amber-800'}`}>{order.status}</span>
                      <span className="font-serif text-xl font-semibold">₵{Number(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-2 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-500">Quantity {item.qty} · ₵{Number(item.lineTotal ?? item.price * item.qty).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default UserDashboard;
