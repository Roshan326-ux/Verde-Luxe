import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('verde_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('verde_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('verde_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('verde_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product, size = null, color = null, qty = 1) => {
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'Standard';
    const selectedColor = color || (product.colors && product.colors[0]) || 'Standard';
    const cartItemId = `${product._id}-${selectedSize}-${selectedColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, qty: Math.min(item.qty + qty, product.countInStock || 99) }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          size: selectedSize,
          color: selectedColor,
          qty
        }
      ];
    });

    showToast(`Added "${product.name}" to your bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, qty: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon('');
    setDiscountPercent(0);
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item._id !== product._id));
      showToast(`Removed from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved to wishlist`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'VERDE20' || clean === 'LUXE20') {
      setCoupon(clean);
      setDiscountPercent(20);
      showToast('20% VIP discount applied!', 'success');
      return { success: true, message: '20% VIP discount applied!' };
    } else if (clean === 'WELCOME10') {
      setCoupon(clean);
      setDiscountPercent(10);
      showToast('10% Welcome discount applied!', 'success');
      return { success: true, message: '10% Welcome discount applied!' };
    } else {
      showToast('Invalid promo code. Try VERDE20 or WELCOME10', 'error');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  // Calculations
  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = Number(((rawSubtotal * discountPercent) / 100).toFixed(2));
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  
  // Free shipping threshold $150
  const freeShippingThreshold = 150;
  const shippingAmount = rawSubtotal === 0 ? 0 : rawSubtotal >= freeShippingThreshold ? 0 : 15.00;
  const taxAmount = Number((subtotalAfterDiscount * 0.08).toFixed(2));
  const totalPrice = Number((subtotalAfterDiscount + shippingAmount + taxAmount).toFixed(2));
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        showToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        coupon,
        discountPercent,
        rawSubtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        totalPrice,
        totalItemsCount,
        freeShippingThreshold
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
