import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer = () => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Welcome to the inner circle. Exclusive preview invite dispatched.', 'success');
    setEmail('');
  };

  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '70px 0 30px',
      marginTop: '80px'
    }}>
      <div className="container">
        {/* Newsletter & Brand Statement */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          paddingBottom: '50px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #065f46)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                color: '#fff',
                fontSize: '1.1rem'
              }}>
                V
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: '800',
                letterSpacing: '0.1em'
              }}>
                VERDE<span style={{ color: '#10b981' }}>.</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: '320px' }}>
              Redefining contemporary haute couture. Ethical Italian craftsmanship,
              Swiss horology, and architectural silhouettes engineered for modern icons.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '14px' }}>
                Collections
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li><a href="#" style={{ color: 'inherit' }}>Men's Tailoring</a></li>
                <li><a href="#" style={{ color: 'inherit' }}>Women's Evening</a></li>
                <li><a href="#" style={{ color: 'inherit' }}>Swiss Horology</a></li>
                <li><a href="#" style={{ color: 'inherit' }}>Artisan Footwear</a></li>
                <li><a href="#" style={{ color: 'inherit' }}>Fine Leather Goods</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '14px' }}>
                Concierge
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li><a href="#" style={{ color: 'inherit' }}>Bespoke Appointments</a></li>
                <li><a href="#" style={{ color: 'inherit' }}>Worldwide Delivery</a></li>
                <li><a href="#" style={{ color: 'inherit' }}>Returns & Exchanges</a></li>
                <li><a href="#" style={{ color: 'inherit' }}>Certificate of Authenticity</a></li>
                <li><a href="#" style={{ color: 'inherit' }}>Contact Atelier</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '10px' }}>
              The Private Salon
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '14px' }}>
              Subscribe to receive private invitations to runway releases, trunk shows, and limited edition drops.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0 16px', borderRadius: 'var(--radius-sm)' }}
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div style={{
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-dim)',
          gap: '16px'
        }}>
          <div>
            &copy; {new Date().getFullYear()} VERDE Atelier &bull; Built with MERN Stack (MongoDB, Express, React, Node.js).
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Ethical Sourcing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
