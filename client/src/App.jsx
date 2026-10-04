import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { MyOrdersModal } from './components/MyOrdersModal';
import { Footer } from './components/Footer';

import { CheckCircle2, AlertCircle, Info, Sparkles, Loader2, RefreshCw } from 'lucide-react';

function MainShop() {
  const { toastMessage, showToast } = useCart();
  const { isAdmin } = useAuth();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [dbStatus, setDbStatus] = useState(null);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const productsSectionRef = useRef(null);

  // Load backend status and products
  const loadData = async () => {
    setLoading(true);
    try {
      // Check health
      const health = await api.checkHealth().catch(() => null);
      if (health) setDbStatus(health);

      // Fetch products
      const data = await api.getProducts({
        category: activeCategory,
        search: searchQuery,
        sort: sortBy
      });
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching catalog:', err);
      showToast('Connecting to backend API...', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeCategory, searchQuery, sortBy]);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            {toastMessage.type === 'error' ? (
              <AlertCircle size={18} color="#ef4444" />
            ) : toastMessage.type === 'info' ? (
              <Info size={18} color="#60a5fa" />
            ) : (
              <CheckCircle2 size={18} className="toast-icon" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        dbStatus={dbStatus}
      />

      {/* Hero Showcase */}
      <HeroBanner
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        onScrollToProducts={scrollToProducts}
      />

      {/* Catalog Section */}
      <main ref={productsSectionRef} style={{ flex: 1 }}>
        <CategoryBar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setSearchQuery('');
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          productCount={products.length}
        />

        <div className="container" style={{ marginBottom: '60px' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 0',
              gap: '16px'
            }}>
              <Loader2 size={36} className="animate-spin" style={{ color: 'var(--emerald-primary)' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Curating fine pieces from the atelier...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '540px',
              margin: '0 auto'
            }}>
              <Sparkles size={40} style={{ color: 'var(--emerald-light)', margin: '0 auto 16px', opacity: 0.6 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>
                No Signature Pieces Found
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                {searchQuery
                  ? `We could not find any items matching "${searchQuery}". Try searching for blazers, watches, boots, or resetting filters.`
                  : 'There are currently no items in this category.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="btn-primary"
                style={{ padding: '10px 20px' }}
              >
                View Full Collection
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => {
          // Refresh list if needed
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductCreated={loadData}
        dbStatus={dbStatus}
      />

      <MyOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainShop />
      </CartProvider>
    </AuthProvider>
  );
}
