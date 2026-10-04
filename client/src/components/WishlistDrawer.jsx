import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';

export const WishlistDrawer = ({ onSelectProduct, onScrollToProducts }) => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    showToast
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        setIsWishlistOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWishlistOpen, setIsWishlistOpen]);

  if (!isWishlistOpen) return null;

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default';
    addToCart(product, 1, size, color);
    showToast(`Added ${product.name} to shopping bag`, 'success');
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
      const color = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default';
      addToCart(product, 1, size, color);
    });
    showToast(`Added all ${wishlist.length} pieces to your bag`, 'success');
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
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-subtle)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444'
              }}
            >
              <Heart size={20} fill="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>
                My Wishlist
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {wishlist.length} {wishlist.length === 1 ? 'curated piece' : 'curated pieces'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
            title="Close Wishlist"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {wishlist.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)'
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Heart size={36} color="var(--text-muted)" style={{ opacity: 0.5 }} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '600' }}>
                Your Wishlist is Empty
              </h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '280px', marginBottom: '24px', lineHeight: '1.5' }}>
                Save exceptional pieces you admire while exploring the atelier to curate your personal wardrobe.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  if (onScrollToProducts) onScrollToProducts();
                }}
                className="btn-primary"
                style={{ padding: '12px 24px', borderRadius: 'var(--radius-full)' }}
              >
                <Sparkles size={16} />
                <span>Explore Atelier Collection</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {/* Item Image */}
                  <div
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(item);
                        setIsWishlistOpen(false);
                      }
                    }}
                    style={{
                      width: '84px',
                      height: '100px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--bg-secondary)',
                      cursor: onSelectProduct ? 'pointer' : 'default'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Item Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: 'var(--emerald-light)',
                              fontWeight: '600'
                            }}
                          >
                            {item.brand || item.category}
                          </span>
                          <h4
                            onClick={() => {
                              if (onSelectProduct) {
                                onSelectProduct(item);
                                setIsWishlistOpen(false);
                              }
                            }}
                            style={{
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              margin: '2px 0 6px',
                              lineHeight: '1.3',
                              cursor: onSelectProduct ? 'pointer' : 'default'
                            }}
                          >
                            {item.name}
                          </h4>
                        </div>

                        {/* Remove from wishlist */}
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="btn-icon"
                          style={{
                            width: '28px',
                            height: '28px',
                            color: 'var(--text-muted)'
                          }}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--emerald-light)' }}>
                          ${Number(item.price).toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              textDecoration: 'line-through'
                            }}
                          >
                            ${Number(item.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Move to bag button */}
                    <div style={{ marginTop: '12px' }}>
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ShoppingBag size={14} />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {wishlist.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <button
              onClick={handleAddAllToCart}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.95rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ShoppingBag size={18} />
              <span>Add All to Bag ({wishlist.length})</span>
            </button>

            <button
              onClick={() => {
                setIsWishlistOpen(false);
                if (onScrollToProducts) onScrollToProducts();
              }}
              className="btn-secondary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.88rem',
                textAlign: 'center'
              }}
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
