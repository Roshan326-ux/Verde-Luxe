import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag, CheckCircle2 } from 'lucide-react';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    rawSubtotal,
    discountAmount,
    discountPercent,
    shippingAmount,
    taxAmount,
    totalPrice,
    coupon,
    applyCoupon,
    freeShippingThreshold
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

  const handleApply = (e) => {
    e.preventDefault();
    if (!promoInput) return;
    applyCoupon(promoInput);
    setPromoInput('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--emerald-light)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', letterSpacing: '0.04em' }}>
              SHOPPING BAG
            </h3>
            <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
              {cart.reduce((s, i) => s + i.qty, 0)} ITEMS
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(16, 185, 129, 0.06)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            marginBottom: '6px'
          }}>
            {remainingForFreeShipping === 0 ? (
              <span style={{ color: 'var(--emerald-light)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> You've unlocked Complimentary Express Delivery!
              </span>
            ) : (
              <span>
                Add <strong style={{ color: 'var(--emerald-light)' }}>${remainingForFreeShipping.toFixed(2)}</strong> for Free Express Shipping
              </span>
            )}
            <span style={{ color: 'var(--text-muted)' }}>{freeShippingProgress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'var(--bg-input)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${freeShippingProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--emerald-primary), #34d399)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {cart.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '40px 0'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: 'var(--text-muted)'
              }}>
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
                Your bag is empty
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '260px', marginBottom: '20px' }}>
                Explore our curated luxury collections to find your signature piece.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  gap: '14px',
                  background: 'var(--bg-card)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  position: 'relative'
                }}
              >
                {/* Item Thumbnail */}
                <div style={{
                  width: '74px',
                  height: '88px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#090e17',
                  flexShrink: 0
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '600', lineHeight: 1.3, marginBottom: '4px' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Size: {item.size} &bull; Color: {item.color}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.qty - 1)}
                        style={{ width: '28px', height: '28px', background: 'transparent', color: 'var(--text-primary)' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', width: '24px', textAlign: 'center' }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.qty + 1)}
                        style={{ width: '28px', height: '28px', background: 'transparent', color: 'var(--text-primary)' }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--emerald-light)' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'transparent',
                    color: 'var(--text-dim)',
                    padding: '4px'
                  }}
                  title="Remove item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)'
          }}>
            {/* Promo Code Form */}
            <form onSubmit={handleApply} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Promo Code (VERDE20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-secondary"
                style={{ padding: '0 16px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
              >
                Apply
              </button>
            </form>

            {/* Quick Promo Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Codes:</span>
              <button
                onClick={() => applyCoupon('VERDE20')}
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--emerald-light)',
                  border: '1px dashed var(--emerald-primary)'
                }}
              >
                VERDE20 (20% Off)
              </button>
              <button
                onClick={() => applyCoupon('WELCOME10')}
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'var(--gold-light)',
                  border: '1px dashed var(--gold-accent)'
                }}
              >
                WELCOME10 (10% Off)
              </button>
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${rawSubtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald-light)' }}>
                  <span>VIP Promo ({coupon} -{discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Express Shipping</span>
                <span>{shippingAmount === 0 ? <strong style={{ color: 'var(--emerald-light)' }}>FREE</strong> : `$${shippingAmount.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Duties & Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <span>Total</span>
                <span style={{ color: 'var(--emerald-light)' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
