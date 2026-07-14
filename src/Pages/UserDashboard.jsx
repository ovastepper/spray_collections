import { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiSearch, FiList, FiClock } from 'react-icons/fi';

const UserDashboard = () => {
  const { orderHistory, currentUser, authReady } = useCart();
  const [showHistory, setShowHistory] = useState(true);
  const [trackName, setTrackName] = useState('');
  const [trackId, setTrackId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');

  const orderedCount = useMemo(() => orderHistory.length, [orderHistory]);

  const handleTrack = () => {
    const nameQuery = trackName.trim().toLowerCase();
    const idQuery = trackId.trim().toLowerCase();

    if (!nameQuery && !idQuery) {
      setSearchMessage('Please enter an item name or order ID to track.');
      setSearchResults([]);
      return;
    }

    const results = orderHistory.filter((order) => {
      const orderMatch = idQuery ? order.id.toLowerCase().includes(idQuery) : true;
      const itemMatch = nameQuery
        ? order.items.some((item) => item.name.toLowerCase().includes(nameQuery))
        : true;
      return orderMatch && itemMatch;
    });

    setSearchResults(results);
    setSearchMessage(results.length === 0 ? 'No matching order found yet.' : '');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {authReady && !currentUser && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            Sign in to load your Firebase order history.
          </div>
        )}
        <div className="mb-10 rounded-2xl sm:rounded-[32px] border border-gray-200 bg-white p-4 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-400">User Dashboard</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-slate-950">Track your orders and review purchase history</h1>
            </div>
            <button onClick={() => setShowHistory(!showHistory)} className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-slate-100 px-4 sm:px-5 py-3 text-xs uppercase tracking-[0.2em] font-bold text-slate-700 hover:bg-slate-200 transition min-h-[44px]">
              <FiList className="w-4 h-4" /> {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-serif font-semibold text-slate-950">Track Item</h2>
                  <p className="text-sm text-slate-500 mt-2">Enter the item name and order ID to check delivery status.</p>
                </div>
                <div className="rounded-full bg-amber-100 text-amber-800 px-4 py-2 text-xs uppercase tracking-[0.25em]">{orderedCount} completed orders</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-600">
                  Item Name
                  <input
                    type="text"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                    className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300"
                    placeholder="e.g. Floral Musk"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  Order ID
                  <input
                    type="text"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                    className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300"
                    placeholder="e.g. ORD-1623456789000"
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button onClick={handleTrack} className="inline-flex items-center justify-center gap-2 rounded-sm bg-black px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold text-white hover:bg-amber-400 transition">
                  <FiSearch className="w-4 h-4" /> Track Item
                </button>
                {searchMessage && <p className="text-sm text-slate-500">{searchMessage}</p>}
              </div>
            </div>

            {showHistory && (
              <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-slate-950">Purchase History</h2>
                    <p className="text-sm text-slate-500 mt-2">Review all completed and pending orders with item IDs and status.</p>
                  </div>
                </div>
                {orderHistory.length === 0 ? (
                  <p className="text-sm text-slate-500">No completed orders are available yet.</p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Order ID</p>
                              <p className="text-lg font-semibold text-slate-950">{order.id}</p>
                            </div>
                            <div className="space-y-1 text-sm text-slate-600">
                              <p><span className="font-semibold text-slate-950">Status:</span> {order.status}</p>
                              <p><span className="font-semibold text-slate-950">Date:</span> {order.date}</p>
                              <p><span className="font-semibold text-slate-950">Total:</span> ₵{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="grid gap-2 sm:grid-cols-[1.2fr_0.8fr] items-center rounded-2xl bg-white p-3 border border-slate-200">
                                <div>
                                  <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                                  <p className="text-xs text-slate-500 mt-1">Item ID: {item.id}</p>
                                </div>
                                <div className="text-sm text-slate-600">
                                  <p>Qty: {item.qty}</p>
                                  <p className="mt-1">₵{(item.price * item.qty).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-serif font-semibold text-slate-950 mb-4">Track Result</h2>
                <div className="space-y-4">
                  {searchResults.map((order) => (
                    <div key={order.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Order ID</p>
                          <p className="text-lg font-semibold text-slate-950">{order.id}</p>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p>Status: {order.status}</p>
                          <p>Date: {order.date}</p>
                          <p>Total: ₵{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.id}`} className="grid gap-2 sm:grid-cols-[1.2fr_0.8fr] items-center rounded-2xl bg-white p-3 border border-slate-200">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                              <p className="text-xs text-slate-500 mt-1">ID: {item.id}</p>
                            </div>
                            <div className="text-sm text-slate-600">
                              <p>Qty: {item.qty}</p>
                              <p className="mt-1">₵{(item.price * item.qty).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-serif font-semibold text-slate-950 mb-4">How it works</h2>
              <div className="space-y-4 text-sm text-slate-600">
                <p className="flex items-start gap-3"><FiClock className="mt-1 h-4 w-4 text-amber-400" /> Use the item name and order ID from your checkout confirmation.</p>
                <p className="flex items-start gap-3"><FiSearch className="mt-1 h-4 w-4 text-amber-400" /> Search orders by exact or partial item name and order ID.</p>
                <p className="flex items-start gap-3"><FiList className="mt-1 h-4 w-4 text-amber-400" /> Review status updates and item IDs for every purchase.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
