import React, { useMemo, useState, useEffect } from 'react';
import { FiGrid, FiSliders, FiPlusSquare, FiShoppingBag, FiSettings } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { categoryFolders } from '../data/productData';

const AdminDashboard = () => {
  const [email, setEmail] = useState('antwid809@gmail.com');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const {
    products,
    updateProduct,
    deleteProductById,
    orderHistory,
    updateOrderStatus,
    currentUser,
    login,
    logout,
    isAdmin,
    authReady,
    companyInfo,
    setCompanyInfo,
    updateCompanyInfo,
    backendError,
    seedStatus
  } = useCart();
  const [searchText, setSearchText] = useState('');
  const [editBuffer, setEditBuffer] = useState({});
  const [companySaveMessage, setCompanySaveMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const orders = orderHistory;

  const filteredProducts = useMemo(() => {
    const lower = searchText.toLowerCase();
    return products.filter((item) => item.name.toLowerCase().includes(lower) || item.category.toLowerCase().includes(lower));
  }, [products, searchText]);

  const dailyOrders = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return orders.filter((order) => (order.createdAt?.toDate?.() || new Date(order.date)) >= start).length;
  }, [orders]);
  const weeklyOrders = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return orders.filter((order) => (order.createdAt?.toDate?.() || new Date(order.date)) >= start).length;
  }, [orders]);
  const totalOrders = useMemo(() => orders.length, [orders]);
  const lowStockProducts = useMemo(
    () => products.filter((product) => (
      product.trackInventory !== false
      && Number(product.stock ?? 0) <= Number(product.lowStockThreshold ?? 3)
    )),
    [products]
  );
  const deliveredRevenue = useMemo(
    () => orders
      .filter((order) => order.status === 'Delivered')
      .reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  const handleLogin = async () => {
    setAuthError('');
    const result = await login({ email, password });
    if (!result.success) setAuthError(result.message);
  };

  const saveCompanyInfo = async () => {
    try {
      await updateCompanyInfo(companyInfo);
      setCompanySaveMessage('Company information saved successfully!');
      setTimeout(() => setCompanySaveMessage(''), 3000);
    } catch {
      setCompanySaveMessage('Unable to save company information.');
    }
  };

  const handleOrderStatus = async (order, status) => {
    setActionMessage('');
    try {
      await updateOrderStatus(order.firestoreId, status);
      setActionMessage(`${order.id} moved to ${status}.`);
    } catch (error) {
      setActionMessage(error.message || 'Unable to update the order.');
    }
  };

  const handleProductChange = (id, field, value) => {
    setEditBuffer((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const saveProductChanges = async (id) => {
    const pending = editBuffer[id];
    if (!pending) return;
    const selectedCategory = pending.category
      ? categoryFolders.find((category) => category.name === pending.category)
      : null;
    const changes = {
      ...pending,
      ...(selectedCategory ? { slug: selectedCategory.slug } : {})
    };
    if (Object.hasOwn(changes, 'price')) changes.price = Number(changes.price);
    if (Object.hasOwn(changes, 'stock')) changes.stock = Number(changes.stock);
    if (Object.hasOwn(changes, 'lowStockThreshold')) changes.lowStockThreshold = Number(changes.lowStockThreshold);
    await updateProduct(id, changes);
    setEditBuffer((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleAvailability = async (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    await updateProduct(id, { available: !product.available });
  };

  const deleteProduct = async (id) => deleteProductById(id);

  const handleCompanyChange = (field, value) => {
    setCompanyInfo((prev) => ({ ...prev, [field]: value }));
  };

  if (!authReady) {
    return <div className="min-h-screen bg-slate-950 p-8 text-center text-white">Checking Firebase session…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16">
        <div className="mx-auto w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
          <h1 className="text-2xl font-serif font-semibold text-slate-950">Manager Access Required</h1>
          {currentUser ? (
            <>
              <p className="my-6 text-sm text-red-600">The signed-in account {currentUser.email} is not authorized to manage this store.</p>
              <button onClick={logout} className="w-full rounded-sm bg-black py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">Sign out</button>
            </>
          ) : (
            <div className="mt-6 space-y-4">
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-sm border border-slate-200 px-4 py-3 text-sm" placeholder="Admin email" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleLogin()} className="w-full rounded-sm border border-slate-200 px-4 py-3 text-sm" placeholder="Firebase password" />
              {authError && <p className="text-sm text-red-600">{authError}</p>}
              <button onClick={handleLogin} className="w-full rounded-sm bg-[#D4AF37] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black">Sign in securely</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] relative">
      <div>
        <div className="flex flex-col md:flex-row">
          <aside className="w-full md:w-56 lg:w-72 bg-[#1a1a1a] text-gray-400 p-4 sm:p-6 flex flex-col space-y-3 sm:space-y-4">
            <div className="border-b border-neutral-800 pb-3 sm:pb-4">
              <h2 className="text-white text-base sm:text-lg font-serif tracking-widest">CIANELLE ADMIN</h2>
            </div>
            {[
              { name: 'Dashboard', icon: <FiGrid /> },
              { name: 'Manage Spray', icon: <FiSliders /> },
              { name: 'Add New Item', icon: <FiPlusSquare /> },
              { name: 'View Orders', icon: <FiShoppingBag /> },
              { name: 'Analytics Dashboard', icon: <FiSettings /> }
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm tracking-wide uppercase transition-colors rounded-sm min-h-[44px] ${activeTab === tab.name ? 'bg-[#D4AF37] text-black font-semibold' : 'hover:bg-neutral-800 hover:text-white'}`}
              >
                {tab.icon}
                <span className="text-xs font-semibold hidden sm:inline">{tab.name}</span>
                <span className="text-xs font-semibold sm:hidden">{tab.name.split(' ')[0]}</span>
              </button>
            ))}
          </aside>

          <main className="flex-1 p-4 sm:p-6 lg:p-10">
              {(backendError || seedStatus === 'running') && (
                <div className={`mb-4 rounded-2xl p-4 text-sm ${backendError ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'}`}>
                  {backendError || 'Seeding the existing catalogue into Firestore…'}
                </div>
              )}
              <div className="bg-white rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 p-4 sm:p-6">
              {activeTab === 'Dashboard' && (
                <div>
                  <div className="mb-8">
                    <h1 className="text-2xl font-serif font-semibold text-slate-950 uppercase tracking-wide">Admin Overview</h1>
                    <p className="text-sm text-slate-500 mt-2">Summary of product, order, and business performance.</p>
                  </div>
                  <div className="grid gap-3 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-6">
                      <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-slate-500">Products</p>
                      <p className="mt-2 sm:mt-4 text-2xl sm:text-3xl font-serif font-semibold text-slate-950">{products.length}</p>
                    </div>
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-6">
                      <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-slate-500">Orders</p>
                      <p className="mt-2 sm:mt-4 text-2xl sm:text-3xl font-serif font-semibold text-slate-950">{totalOrders}</p>
                    </div>
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-6">
                      <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-slate-500">Low stock</p>
                      <p className={`mt-2 sm:mt-4 text-2xl sm:text-3xl font-serif font-semibold ${lowStockProducts.length ? 'text-red-600' : 'text-slate-950'}`}>{lowStockProducts.length}</p>
                    </div>
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-6">
                      <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-slate-500">Delivered revenue</p>
                      <p className="mt-2 sm:mt-4 text-sm sm:text-2xl font-serif font-semibold text-slate-950">₵{deliveredRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Manage Spray' && (
                <div>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl font-serif font-semibold text-slate-950">Manage Spray</h1>
                      <p className="text-sm text-slate-500 mt-2">Search, edit, mark unavailable, or delete items.</p>
                    </div>
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search products..."
                      className="w-full md:w-64 border border-slate-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-[0.3em] text-slate-500">
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3">Image</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Stock</th>
                          <th className="px-4 py-3">Low-stock alert</th>
                          <th className="px-4 py-3">Availability</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="bg-slate-50 rounded-3xl">
                            <td className="px-4 py-4 align-top">
                              <div className="font-semibold text-slate-950">{product.name}</div>
                              <div className="text-xs text-slate-500">{product.description}</div>
                            </td>
                            <td className="px-4 py-4 align-top">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover border border-slate-200" />
                              ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 text-[10px] text-slate-400">No image</div>
                              )}
                            </td>
                            <td className="px-4 py-4 align-top">
                              <select
                                value={editBuffer[product.id]?.category ?? product.category}
                                onChange={(e) => handleProductChange(product.id, 'category', e.target.value)}
                                className="border border-slate-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                              >
                                {categoryFolders.map((cat) => (
                                  <option key={cat.slug} value={cat.name}>{cat.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <input
                                type="number"
                                value={editBuffer[product.id]?.price ?? product.price}
                                onChange={(e) => handleProductChange(product.id, 'price', e.target.value)}
                                className="w-24 border border-slate-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                              />
                            </td>
                            <td className="px-4 py-4 align-top">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={editBuffer[product.id]?.stock ?? product.stock ?? 0}
                                onChange={(e) => handleProductChange(product.id, 'stock', e.target.value)}
                                className={`w-24 rounded-sm border px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] ${
                                  Number(product.stock) <= Number(product.lowStockThreshold ?? 3)
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-slate-200'
                                }`}
                              />
                            </td>
                            <td className="px-4 py-4 align-top">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={editBuffer[product.id]?.lowStockThreshold ?? product.lowStockThreshold ?? 3}
                                onChange={(e) => handleProductChange(product.id, 'lowStockThreshold', e.target.value)}
                                className="w-24 rounded-sm border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                              />
                            </td>
                            <td className="px-4 py-4 align-top">
                              <button
                                onClick={() => toggleAvailability(product.id)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold ${product.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                              >
                                {product.available ? 'Available' : 'Unavailable'}
                              </button>
                            </td>
                            <td className="px-4 py-4 align-top space-y-2">
                              <button onClick={() => saveProductChanges(product.id)} className="w-full rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-amber-300 transition">
                                Save Changes
                              </button>
                              <button onClick={() => deleteProduct(product.id)} className="w-full rounded-full bg-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-red-600 transition">
                                Archive
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Add New Item' && (
                <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-8">
                  <h1 className="text-2xl font-serif font-semibold text-slate-950">New product uploads are paused</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-amber-900">
                    Existing product details, prices, categories and availability are stored in Firestore and can be edited under Manage Spray. Adding a product with a new image requires Firebase Storage, which is intentionally disabled until the owner enables Blaze billing.
                  </p>
                </div>
              )}

              {activeTab === 'View Orders' && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-serif font-semibold text-slate-950">View Orders & Company Settings</h1>
                    <p className="text-sm text-slate-500 mt-2">Review current orders and update business contact details.</p>
                  </div>
                  <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                      <div className="rounded-2xl sm:rounded-[32px] border border-slate-200 bg-slate-50 p-4 sm:p-6">
                        <h2 className="text-xl font-semibold text-slate-950 mb-4">Orders</h2>
                        {actionMessage && (
                          <p className="mb-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{actionMessage}</p>
                        )}
                        {orders.length === 0 ? (
                          <p className="text-sm text-slate-500">There are no current orders in the system.</p>
                        ) : (
                          <div className="space-y-4">
                            {orders.map((order) => (
                              <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                  <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Order ID</p>
                                    <p className="font-semibold text-slate-950">{order.id}</p>
                                  </div>
                                  <span className={`text-xs uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div className="space-y-2 text-sm mb-4">
                                  <div><span className="text-slate-500">Customer: </span><span className="font-semibold text-slate-950">{order.customer}</span></div>
                                  <div><span className="text-slate-500">Total: </span><span className="font-semibold text-slate-950">₵{order.total.toFixed(2)}</span></div>
                                  <div><span className="text-slate-500">Date: </span><span className="font-semibold text-slate-950">{order.date}</span></div>
                                </div>
                                {order.items && order.items.length > 0 && (
                                  <div className="mb-4 border-t border-slate-200 pt-3">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2">Items</p>
                                    <div className="space-y-1 text-xs">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-slate-600">
                                          <span>{item.name} (ID: {item.id}) x{item.qty}</span>
                                          <span>₵{(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <select
                                  value=""
                                  onChange={(event) => {
                                    if (event.target.value) handleOrderStatus(order, event.target.value);
                                  }}
                                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:bg-slate-100"
                                >
                                  <option value="">Update status…</option>
                                  {order.status === 'Pending' && <option value="Confirmed">Confirm order</option>}
                                  {order.status === 'Confirmed' && <option value="Processing">Start processing</option>}
                                  {order.status === 'Processing' && <option value="Ready">Mark ready</option>}
                                  {order.status === 'Ready' && <option value="Delivered">Mark delivered</option>}
                                  {!['Delivered', 'Cancelled'].includes(order.status) && <option value="Cancelled">Cancel and restore stock</option>}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl sm:rounded-[32px] border border-slate-200 bg-slate-50 p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-950 mb-3 sm:mb-4">Company Info</h2>
                      {companySaveMessage && (
                        <div className="mb-4 rounded-lg bg-emerald-100 text-emerald-700 p-3 text-xs font-semibold uppercase tracking-[0.2em]">
                          {companySaveMessage}
                        </div>
                      )}
                      {['name', 'phone', 'email', 'address', 'days', 'times'].map((field) => (
                        <div key={field} className="mb-3 sm:mb-4">
                          <label className="block text-xs uppercase tracking-[0.35em] text-slate-500 font-semibold mb-2">{field === 'name' ? 'Company Name' : field === 'phone' ? 'Phone' : field === 'email' ? 'Email' : field === 'address' ? 'Address' : field === 'days' ? 'Opening Days' : 'Opening Times'}</label>
                          <input
                            type="text"
                            value={companyInfo[field]}
                            onChange={(e) => handleCompanyChange(field, e.target.value)}
                            className="w-full border border-slate-200 rounded-sm px-3 sm:px-4 py-2 sm:py-3 text-sm focus:outline-none focus:border-[#D4AF37] min-h-[44px]"
                          />
                        </div>
                      ))}
                      <button
                        onClick={saveCompanyInfo}
                        className="w-full bg-[#D4AF37] text-black px-4 py-3 rounded-sm text-xs font-semibold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition mt-6"
                      >
                        Save Company Info
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Analytics Dashboard' && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-serif font-semibold text-slate-950">Analytics Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-2">Monitor order activity and fulfilment history.</p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      { label: 'Daily Orders', value: dailyOrders },
                      { label: 'Weekly Orders', value: weeklyOrders },
                      { label: 'Low Stock Products', value: lowStockProducts.length }
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{stat.label}</p>
                        <p className="mt-4 text-4xl font-serif font-semibold text-slate-950">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-950">Permanent order history</h2>
                    <p className="mt-2 text-sm text-slate-500">Orders are retained for customer support, fulfilment tracking and accurate analytics.</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
