import React from 'react';
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw } from 'lucide-react';

export const HeroBanner = ({ onSelectCategory, onScrollToProducts }) => {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '70px 0 50px',
      background: 'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(30, 41, 59, 0.5) 0%, transparent 50%), var(--bg-deep)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Column: Headline & CTA */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '999px',
              color: 'var(--emerald-light)',
              fontSize: '0.82rem',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              <Sparkles size={14} />
              <span>AUTUMN / WINTER 2026 EDITION</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.1,
              fontWeight: '800',
              marginBottom: '20px',
              letterSpacing: '-0.03em'
            }}>
              Masterpieces in <br />
              <span style={{
                background: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Modern Elegance
              </span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '520px',
              marginBottom: '32px'
            }}>
              Uncompromising craftsmanship. From tailored Milanese virgin wool blazers
              to Swiss automatic chronographs and handcrafted leather boots.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '40px' }}>
              <button
                onClick={() => {
                  onSelectCategory('All');
                  onScrollToProducts();
                }}
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                <span>Discover Collection</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => {
                  onSelectCategory('Watches');
                  onScrollToProducts();
                }}
                className="btn-secondary"
                style={{ padding: '14px 26px', fontSize: '1rem' }}
              >
                <span>Swiss Timepieces</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ color: 'var(--emerald-light)' }}><Truck size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Express Shipping</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Free over $150</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ color: 'var(--gold-light)' }}><Shield size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Authenticity Verified</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Genuine Luxury</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ color: '#60a5fa' }}><RefreshCw size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>30-Day Returns</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No questions asked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop"
                alt="Emerald Horizon Watch"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7, 10, 16, 0.95) 0%, rgba(7, 10, 16, 0.2) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '28px'
              }}>
                <span className="badge badge-emerald" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                  FEATURED HOROLOGY
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' }}>
                  Emerald Horizon Chronograph
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Swiss automatic movement &bull; 316L Stainless Steel &bull; Alligator leather strap
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--emerald-light)' }}>
                      $349.00
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      $450.00
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectCategory('Watches');
                      onScrollToProducts();
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-full)' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
