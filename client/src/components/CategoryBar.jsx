import React from 'react';
import { Sparkles, Shirt, Watch, ShoppingBag, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Collections' },
  { id: 'Men', label: "Men's Apparel" },
  { id: 'Women', label: "Women's Couture" },
  { id: 'Watches', label: 'Horology & Watches' },
  { id: 'Shoes', label: 'Footwear & Boots' },
  { id: 'Accessories', label: 'Fine Accessories' }
];

export const CategoryBar = ({
  activeCategory,
  onSelectCategory,
  sortBy,
  setSortBy,
  productCount
}) => {
  return (
    <div style={{
      padding: '24px 0',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: '32px'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Category Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px'
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '600' : '500',
                  background: isActive
                    ? 'linear-gradient(135deg, var(--emerald-primary), var(--emerald-hover))'
                    : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--emerald-primary)' : '1px solid var(--border-subtle)',
                  boxShadow: isActive ? '0 4px 14px var(--emerald-glow)' : 'none',
                  transition: 'var(--transition-fast)'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort & Count Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{productCount}</strong> items
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: 'none',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="newest" style={{ background: '#141d30' }}>Newest Arrivals</option>
              <option value="price-low" style={{ background: '#141d30' }}>Price: Low to High</option>
              <option value="price-high" style={{ background: '#141d30' }}>Price: High to Low</option>
              <option value="rating" style={{ background: '#141d30' }}>Customer Rating</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
