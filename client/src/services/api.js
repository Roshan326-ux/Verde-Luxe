const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(productData, token) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id, productData, token) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update product');
    }
    return res.json();
  },

  async deleteProduct(id, token) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete product');
    }
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getProfile(token) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: getHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  // Orders
  async createOrder(orderData, token) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return data;
  },

  async getMyOrders(token) {
    const res = await fetch(`${API_BASE}/orders/myorders`, {
      headers: getHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getAllOrders(token) {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch store orders');
    return res.json();
  },

  async updateOrderStatus(id, status, token) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.json();
    } catch {
      return { status: 'offline' };
    }
  }
};
