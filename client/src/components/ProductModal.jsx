import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Star, ShoppingBag, Heart, Shield, Check, Send } from 'lucide-react';

export const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart, toggleWishlist, isInWishlist, showToast } = useCart();
  const { user } = useAuth();
  
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState((product.sizes && product.sizes[0]) || 'Standard');
  const [selectedColor, setSelectedColor] = useState((product.colors && product.colors[0]) || 'Standard');
  const [qty, setQty] = useState(1);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const inWishlist = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, qty);
    onClose();
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    
    // Optimistically update reviews locally
    product.reviews = product.reviews || [];
    product.reviews.push({
      _id: `rev_${Date.now()}`,
      name: user ? user.name : 'Valued Patron',
      rating: newReviewRating,
      comment: newReviewText,
      createdAt: new Date().toISOString()
    });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    setNewReviewText('');
    showToast('Your verified review has been published!', 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px', padding: '0', overflow: 'hidden' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(7, 10, 16, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '0'
        }}>
          {/* Left: Gallery */}
          <div style={{ background: '#090e17', padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '100%',
              paddingTop: '100%',
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)'
            }}>
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--emerald-primary)' : '1px solid var(--border-subtle)',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <Shield size={18} style={{ color: 'var(--emerald-light)', flexShrink: 0 }} />
              <span>Certified authentic. Hand-inspected by master artisans prior to dispatch.</span>
            </div>
          </div>

          {/* Right: Details & Selection */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {product.brand} &bull; {product.category}
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '12px' }}>
              {product.name}
            </h2>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={15}
                    fill={s <= Math.round(product.rating || 5) ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gold-light)' }}>
                {product.rating ? product.rating.toFixed(1) : '5.0'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                &bull; {product.numReviews || 0} client reviews
              </span>
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--emerald-light)', fontFamily: 'var(--font-heading)' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                  Color Tone: <span style={{ color: 'var(--text-muted)' }}>{selectedColor}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem',
                        background: selectedColor === c ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-input)',
                        color: selectedColor === c ? 'var(--emerald-light)' : 'var(--text-secondary)',
                        border: selectedColor === c ? '1px solid var(--emerald-primary)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                    Select Size: <span style={{ color: 'var(--text-muted)' }}>{selectedSize}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--emerald-light)', cursor: 'pointer' }}>
                    Size Guide
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        minWidth: '44px',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: selectedSize === s ? 'var(--emerald-primary)' : 'var(--bg-input)',
                        color: selectedSize === s ? '#ffffff' : 'var(--text-secondary)',
                        border: selectedSize === s ? '1px solid var(--emerald-primary)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: '38px', height: '44px', background: 'transparent', color: 'var(--text-primary)', fontSize: '1.1rem' }}
                >
                  -
                </button>
                <span style={{ width: '32px', textAlign: 'center', fontWeight: '600', fontSize: '0.95rem' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.countInStock || 99, qty + 1))}
                  style={{ width: '38px', height: '44px', background: 'transparent', color: 'var(--text-primary)', fontSize: '1.1rem' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="btn-primary"
                style={{ flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-md)' }}
              >
                <ShoppingBag size={18} />
                <span>Add To Bag &bull; ${(product.price * qty).toFixed(2)}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="btn-icon"
                style={{ height: '48px', width: '48px', borderRadius: 'var(--radius-md)' }}
                title="Wishlist"
              >
                <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : 'currentColor'} />
              </button>
            </div>

            {/* Client Reviews Section */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '14px' }}>
                Client Reviews ({product.reviews?.length || 0})
              </h4>

              {/* Review Input */}
              <form onSubmit={handleAddReview} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Share your experience..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                />
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  style={{
                    background: 'var(--bg-input)',
                    color: 'var(--gold-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0 8px',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value={5}>5 ★</option>
                  <option value={4}>4 ★</option>
                  <option value={3}>3 ★</option>
                  <option value={2}>2 ★</option>
                  <option value={1}>1 ★</option>
                </select>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)' }}
                >
                  <Send size={14} />
                </button>
              </form>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.slice(-3).reverse().map((r, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{r.name}</span>
                        <span style={{ color: 'var(--gold-light)' }}>{'★'.repeat(r.rating)}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    Be the first connoisseur to review this piece.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
