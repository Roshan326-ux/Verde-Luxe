import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { X, Lock, Mail, User as UserIcon, Shield, Check, Loader2 } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { login, register, loading } = useAuth();
  const { showToast } = useCart();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'login') {
        const user = await login(email, password);
        showToast(`Welcome back, ${user.name}!`, 'success');
        onClose();
      } else {
        if (!name.trim()) {
          setError('Please provide your full name');
          return;
        }
        const user = await register(name, email, password);
        showToast(`Welcome to VERDE Atelier, ${user.name}!`, 'success');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    }
  };

  const fillDemo = (role) => {
    setError(null);
    if (role === 'admin') {
      setEmail('admin@greenhole.com');
      setPassword('admin123');
      setMode('login');
    } else {
      setEmail('customer@greenhole.com');
      setPassword('customer123');
      setMode('login');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '32px' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        {/* Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #065f46)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '800',
            fontSize: '1.3rem',
            marginBottom: '10px',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
          }}>
            V
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>
            {mode === 'login' ? 'Patron Sign In' : 'Join The Atelier'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {mode === 'login'
              ? 'Access bespoke services, wishlists, and order history'
              : 'Create an account to unlock complimentary VIP benefits'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: mode === 'login' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: mode === 'register' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'register' ? 'var(--text-primary)' : 'var(--text-muted)'
            }}
          >
            Register
          </button>
        </div>

        {/* Quick Demo Autofill Helper */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px dashed rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginBottom: '18px',
          fontSize: '0.78rem'
        }}>
          <div style={{ fontWeight: '600', color: 'var(--emerald-light)', marginBottom: '4px' }}>
            Instant Testing (1-Click Fill):
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--gold-light)',
                fontWeight: '600',
                fontSize: '0.75rem'
              }}
            >
              Fill Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemo('customer')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '0.75rem'
              }}
            >
              Fill Customer Demo
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Roshan Goyal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    color: '#fff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  color: '#fff',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  color: '#fff',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', marginTop: '8px' }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span>{mode === 'login' ? 'Sign In to Your Account' : 'Complete Registration'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
