import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import {
  X,
  PlusCircle,
  Package,
  DollarSign,
  TrendingUp,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  Layers,
  ShieldAlert
} from 'lucide-react';

export const AdminPanel = ({ isOpen, onClose, onProductCreated, dbStatus }) => {
  if (!isOpen) return null;

  const { token } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'add'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // New product form
  const [newProd, setNewProd] = useState({
    name: '',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
    brand: 'VERDE Atelier',
    category: 'Men',
    price: 199.00,
    originalPrice: 260.00,
    countInStock: 15,
    description: 'Bespoke tailored luxury piece crafted with highest precision and hand-finished detailing.',
    colors: 'Black, Navy, Forest Green',
    sizes: 'S, M, L, XL'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, prodsRes] = await Promise.all([
        api.getAllOrders(token).catch(() => []),
        api.getProducts().catch(() => ({ products: [] }))
      ]);
      setOrders(ordersRes || []);
      setProducts(prodsRes.products || []);
    } catch {
      showToast('Could not fetch admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProd,
        price: Number(newProd.price),
        originalPrice: Number(newProd.originalPrice),
        countInStock: Number(newProd.countInStock),
        colors: newProd.colors.split(',').map((c) => c.trim()),
        sizes: newProd.sizes.split(',').map((s) => s.trim()),
        isNewArrival: true,
        isFeatured: true
      };

      const created = await api.createProduct(payload, token);
      showToast(`Product "${created.name}" created!`, 'success');
      setProducts([created, ...products]);
      if (onProductCreated) onProductCreated();
      setActiveTab('products');
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"?`)) return;
    try {
      await api.deleteProduct(id, token);
      setProducts(products.filter((p) => p._id !== id));
      showToast(`Removed "${name}" from store`, 'info');
      if (onProductCreated) onProductCreated();
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, token);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1000px', height: '88vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-deep)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-gold">STORE EXECUTIVE PORTAL</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Database: <strong style={{ color: 'var(--emerald-light)' }}>{dbStatus?.database || 'Local Store'}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '2px' }}>
              Store Operations & Catalog Management
            </h2>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ width: '38px', height: '38px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Top Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          padding: '18px 28px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Gross Revenue</div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--emerald-light)' }}>
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Orders</div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800' }}>{orders.length}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pending Dispatch</div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--gold-light)' }}>{pendingOrders}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Live Catalog Items</div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800' }}>{products.length}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 28px',
          background: 'var(--bg-deep)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('orders')}
            className={activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
          >
            Orders History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={activeTab === 'add' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
          >
            <PlusCircle size={15} />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No orders recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map((o) => (
                    <div
                      key={o._id}
                      style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        padding: '18px'
                      }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700' }}>
                            Order #{o._id} &bull; <span style={{ color: 'var(--text-secondary)' }}>{o.customerName || 'Customer'}</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {new Date(o.createdAt).toLocaleString()} &bull; {o.paymentMethod}
                          </div>
                        </div>

                        {/* Status Changer */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                            style={{
                              background: 'var(--bg-input)',
                              color: o.status === 'Delivered' ? 'var(--emerald-light)' : o.status === 'Shipped' ? '#60a5fa' : 'var(--gold-light)',
                              fontWeight: '600',
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.85rem'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                        {o.orderItems?.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                            <img src={it.image} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                            <span>{it.name} ({it.size || 'Std'}) &times; {it.qty}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          Destination: {o.shippingAddress?.address}, {o.shippingAddress?.city}
                        </span>
                        <strong style={{ color: 'var(--emerald-light)', fontSize: '1rem' }}>
                          Total: ${o.totalPrice?.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {products.map((p) => (
                <div
                  key={p._id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    padding: '12px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                  }}
                >
                  <img src={p.image} alt="" style={{ width: '60px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{p.category}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--emerald-light)', fontWeight: '700' }}>
                      ${p.price.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      In Stock: {p.countInStock}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p._id, p.name)}
                    style={{ background: 'transparent', color: '#f87171', padding: '6px' }}
                    title="Remove Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleCreateProduct} style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px' }}>
                Add New Catalog Product
              </h3>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Product Title *</label>
                <input
                  type="text"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Royal Merino Cashmere Scarf"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Watches">Watches</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Brand Atelier</label>
                  <input
                    type="text"
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Inventory Count</label>
                  <input
                    type="number"
                    value={newProd.countInStock}
                    onChange={(e) => setNewProd({ ...newProd, countInStock: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Image URL (Unsplash HD)</label>
                <input
                  type="text"
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={newProd.sizes}
                    onChange={(e) => setNewProd({ ...newProd, sizes: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={newProd.colors}
                    onChange={(e) => setNewProd({ ...newProd, colors: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', alignSelf: 'flex-start' }}
              >
                Publish Product to Store
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
