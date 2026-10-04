import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

export const MyOrdersModal = ({ isOpen, onClose, onOpenAuth }) => {
  if (!isOpen) return null;

  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      api.getMyOrders(token)
        .then((res) => setOrders(res || []))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0 }}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-deep)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={20} style={{ color: 'var(--emerald-light)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Your Orders & History</h3>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '36px', height: '36px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {!user ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <AlertCircle size={36} style={{ color: 'var(--gold-light)', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Sign in to View Order History</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px' }}>
                Track package dispatches, view invoices, and manage past purchases.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="btn-primary"
                style={{ padding: '10px 24px' }}
              >
                Sign In Now
              </button>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <h4>No orders on record</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                You haven't placed any orders with this account yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((o) => (
                <div
                  key={o._id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                        Order #{o._id}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Placed on {new Date(o.createdAt).toLocaleDateString()} &bull; {o.paymentMethod}
                      </div>
                    </div>

                    <span
                      className={
                        o.status === 'Delivered'
                          ? 'badge badge-emerald'
                          : o.status === 'Shipped'
                          ? 'badge badge-gold'
                          : 'badge'
                      }
                      style={{
                        background: o.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: o.status === 'Delivered' ? 'var(--emerald-light)' : 'var(--gold-light)'
                      }}
                    >
                      {o.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {o.orderItems?.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={it.image} alt="" style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{it.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Qty: {it.qty} &bull; Size: {it.size || 'Std'}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                          ${(it.price * it.qty).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Shipping to: {o.shippingAddress?.city}, {o.shippingAddress?.country}
                    </span>
                    <strong style={{ color: 'var(--emerald-light)', fontSize: '1rem' }}>
                      ${o.totalPrice?.toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
