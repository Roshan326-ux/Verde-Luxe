import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, Smartphone, ArrowRight, Loader2 } from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose, onOrderSuccess }) => {
  if (!isOpen) return null;

  const {
    cart,
    rawSubtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    totalPrice,
    clearCart,
    showToast
  } = useCart();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    address: 'Via Montenapoleone, 14',
    city: 'Milan',
    postalCode: '20121',
    country: 'Italy',
    paymentMethod: 'Credit / Debit Card'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address || !formData.city) {
      showToast('Please fill out all required shipping details', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerName: formData.name,
        customerEmail: formData.email,
        orderItems: cart.map(item => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
          size: item.size,
          color: item.color
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: rawSubtotal - discountAmount,
        shippingPrice: shippingAmount,
        taxPrice: taxAmount,
        totalPrice: totalPrice
      };

      const createdOrder = await api.createOrder(orderPayload, token);
      setOrderComplete(createdOrder);
      clearCart();
      showToast('Order confirmed! A confirmation email is on its way.', 'success');
      if (onOrderSuccess) onOrderSuccess(createdOrder);
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', padding: '32px' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            color: 'var(--text-muted)',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {orderComplete ? (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--emerald-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--emerald-light)'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>
              ORDER COMPLETED
            </span>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
              Thank You for Your Patronage
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 24px' }}>
              Order Reference: <strong style={{ color: 'var(--emerald-light)' }}>#{orderComplete._id}</strong>
              <br />
              We have initiated priority preparation and bespoke packaging for your items.
            </p>

            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left',
              marginBottom: '24px',
              fontSize: '0.88rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery</span>
                <strong>3 - 5 Business Days (Express Air)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Address</span>
                <span>{orderComplete.shippingAddress?.address}, {orderComplete.shippingAddress?.city}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Billed</span>
                <strong style={{ color: 'var(--emerald-light)' }}>${orderComplete.totalPrice?.toFixed(2)}</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ padding: '12px 28px', borderRadius: 'var(--radius-md)' }}
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-light)', fontSize: '0.85rem', fontWeight: '600' }}>
                <ShieldCheck size={16} />
                <span>256-BIT ENCRYPTED LUXURY CHECKOUT</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '4px' }}>
                Finalize Your Order
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Shipping Section */}
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  1. Shipping Information
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Roshan Goyal"
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. roshan@example.com"
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 42 Luxury Avenue, Penthouse B"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  2. Payment Method
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'Credit / Debit Card', icon: CreditCard, label: 'Credit Card' },
                    { id: 'UPI / Digital Wallet', icon: Smartphone, label: 'UPI / Wallet' },
                    { id: 'Cash on Delivery', icon: Truck, label: 'Pay on Delivery' }
                  ].map((method) => {
                    const isSelected = formData.paymentMethod === method.id;
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-input)',
                          border: isSelected ? '1px solid var(--emerald-primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          textAlign: 'center',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        <Icon size={20} color={isSelected ? 'var(--emerald-light)' : 'var(--text-muted)'} />
                        <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? '600' : '500', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                          {method.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Breakdown Box */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Items ({cart.reduce((s, i) => s + i.qty, 0)})</span>
                  <span>${(rawSubtotal - discountAmount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Express Worldwide Shipping</span>
                  <span>{shippingAmount === 0 ? <strong style={{ color: 'var(--emerald-light)' }}>FREE</strong> : `$${shippingAmount.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span>Taxes & Duties</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                  <span>Total Due</span>
                  <span style={{ color: 'var(--emerald-light)' }}>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Authorizing & Placing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order &bull; ${totalPrice.toFixed(2)}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
