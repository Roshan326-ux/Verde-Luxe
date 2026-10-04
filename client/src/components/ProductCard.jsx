import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(product._id);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: isHovered ? '1px solid var(--border-active)' : '1px solid var(--border-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isHovered ? 'var(--shadow-md), var(--shadow-glow)' : 'var(--shadow-sm)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}
    >
      {/* Product Image Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '120%',
        background: '#090e17',
        overflow: 'hidden'
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 2
        }}>
          {discountPercent > 0 && (
            <span className="badge badge-emerald">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="badge badge-gold">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: inWishlist ? '#ef4444' : 'rgba(7, 10, 16, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: inWishlist ? '#ffffff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            transition: 'var(--transition-fast)'
          }}
        >
          <Heart size={16} fill={inWishlist ? '#ffffff' : 'none'} />
        </button>

        {/* Hover Quick Actions */}
        <div style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          right: '14px',
          display: 'flex',
          gap: '8px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.25s ease-out',
          zIndex: 3
        }}>
          <button
            onClick={() => onQuickView(product)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              background: 'rgba(14, 20, 34, 0.92)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>

          <button
            onClick={() => addToCart(product)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              background: 'linear-gradient(135deg, var(--emerald-primary), var(--emerald-hover))',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              boxShadow: '0 4px 12px var(--emerald-glow)'
            }}
            title="Add to Bag"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px'
        }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            {product.brand}
          </span>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--gold-light)' }}>
              {product.rating ? product.rating.toFixed(1) : '5.0'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              ({product.numReviews || 0})
            </span>
          </div>
        </div>

        <h3
          onClick={() => onQuickView(product)}
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '10px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            lineHeight: 1.35
          }}
        >
          {product.name}
        </h3>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--emerald-light)',
            fontFamily: 'var(--font-heading)'
          }}>
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span style={{
              fontSize: '0.85rem',
              color: 'var(--text-dim)',
              textDecoration: 'line-through'
            }}>
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.countInStock <= 5 && product.countInStock > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#f87171', fontWeight: '500' }}>
              Only {product.countInStock} left
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
