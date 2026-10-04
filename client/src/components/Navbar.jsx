import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  ShieldCheck,
  Package,
  LogOut,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  onOpenAuth,
  onOpenAdmin,
  onOpenOrders,
  dbStatus
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItemsCount, totalPrice, setIsCartOpen, wishlist, setIsWishlistOpen } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 500,
      background: 'rgba(7, 10, 16, 0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'var(--transition-fast)'
    }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #064e3b, #047857, #064e3b)',
        padding: '6px 16px',
        textAlign: 'center',
        fontSize: '0.8rem',
        fontWeight: '500',
        letterSpacing: '0.04em',
        color: '#d1fae5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <Sparkles size={14} style={{ color: '#fbbf24' }} />
        <span>COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING ON ORDERS OVER $150 &bull; USE CODE <strong>VERDE20</strong> FOR 20% OFF</span>
      </div>

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        gap: '24px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #065f46)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
            }}>
              <span style={{ fontWeight: '800', fontSize: '1.25rem', color: '#fff' }}>V</span>
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: '800',
                letterSpacing: '0.12em',
                lineHeight: 1,
                background: 'linear-gradient(90deg, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                VERDE<span style={{ color: '#10b981' }}>.</span>
              </div>
              <div style={{
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                color: 'var(--text-muted)',
                fontWeight: '600',
                marginTop: '2px'
              }}>
                HAUTE COUTURE
              </div>
            </div>
          </a>

          {/* Database indicator pill */}
          <div
            title={`Active Backend: ${dbStatus?.database || 'Local Fast-Store'}`}
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)'
            }}
            className="db-badge"
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
            <span>MERN Active</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: '460px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '16px',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search blazers, watches, boots, gowns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 40px 11px 44px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              border: '1px solid var(--border-subtle)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '1rem',
                padding: '4px'
              }}
            >
              &times;
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="btn-icon"
            style={{ position: 'relative' }}
            title={`Wishlist (${wishlist.length} saved)`}
          >
            <Heart size={20} fill={wishlist.length > 0 ? '#ef4444' : 'none'} color={wishlist.length > 0 ? '#ef4444' : 'currentColor'} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
              }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-primary"
            style={{ padding: '10px 18px', borderRadius: 'var(--radius-full)' }}
          >
            <ShoppingBag size={18} />
            <span>Bag</span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.25)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              {totalItemsCount}
            </span>
            {rawTotalPrice(totalPrice) > 0 && (
              <span style={{ fontSize: '0.85rem', opacity: 0.9, marginLeft: '2px' }}>
                ${totalPrice.toFixed(2)}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isAdmin ? 'linear-gradient(135deg, #f59e0b, #b45309)' : 'linear-gradient(135deg, #10b981, #065f46)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  color: '#fff'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '500', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                    Admin
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn-secondary"
                style={{ padding: '9px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}
              >
                <UserIcon size={16} />
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {user && userDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-modal)',
                  width: '220px',
                  padding: '8px',
                  zIndex: 600,
                  animation: 'fadeIn 0.2s ease-out'
                }}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAdmin();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      color: 'var(--gold-light)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginTop: '6px'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onOpenOrders();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    marginTop: '4px'
                  }}
                >
                  <Package size={16} />
                  <span>My Orders</span>
                </button>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    marginTop: '4px'
                  }}
                >
                  <Heart size={16} color="#ef4444" />
                  <span>Saved Wishlist ({wishlist.length})</span>
                </button>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: 'transparent',
                    color: '#f87171',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    marginTop: '4px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const rawTotalPrice = (val) => (typeof val === 'number' ? val : 0);
