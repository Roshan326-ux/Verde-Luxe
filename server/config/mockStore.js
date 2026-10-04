import { sampleProducts } from '../data/products.js';
import bcrypt from 'bcryptjs';

// In-Memory store simulating MongoDB collections for offline / local-first development
class MockStore {
  constructor() {
    this.products = [];
    this.users = [];
    this.orders = [];
    this.init();
  }

  async init() {
    // Populate products with mock string IDs
    this.products = sampleProducts.map((p, index) => ({
      _id: `prod_${index + 1}`,
      ...p,
      createdAt: new Date().toISOString()
    }));

    // Seed default admin and customer
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    this.users = [
      {
        _id: 'user_admin',
        name: 'Store Admin',
        email: 'admin@greenhole.com',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'user_customer',
        name: 'Roshan Goyal',
        email: 'customer@greenhole.com',
        password: customerPassword,
        role: 'customer',
        createdAt: new Date().toISOString()
      }
    ];

    // Seed a couple of demo orders
    this.orders = [
      {
        _id: 'order_1001',
        user: 'user_customer',
        customerName: 'Roshan Goyal',
        customerEmail: 'customer@greenhole.com',
        orderItems: [
          {
            _id: 'item_1',
            name: this.products[0].name,
            qty: 1,
            image: this.products[0].image,
            price: this.products[0].price,
            size: '40R',
            color: 'Charcoal Grey',
            product: this.products[0]._id
          }
        ],
        shippingAddress: {
          address: '42 Fashion Blvd, Suite 100',
          city: 'Milan',
          postalCode: '20121',
          country: 'Italy'
        },
        paymentMethod: 'Credit / Debit Card',
        itemsPrice: 249.99,
        shippingPrice: 0,
        taxPrice: 25.00,
        totalPrice: 274.99,
        isPaid: true,
        paidAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'Processing',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    console.log('⚡ Mock In-Memory Store initialized with sample products, users, and orders.');
  }

  // Product helpers
  getProducts({ category, search, minPrice, maxPrice, sort }) {
    let result = [...this.products];

    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (minPrice !== undefined && !isNaN(minPrice)) {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // default newest / id
      result.reverse();
    }

    return result;
  }

  getProductById(id) {
    return this.products.find(p => p._id.toString() === id.toString());
  }

  createProduct(data) {
    const newProduct = {
      _id: `prod_${Date.now()}`,
      rating: 5.0,
      numReviews: 1,
      reviews: [],
      images: data.images || [data.image],
      isFeatured: data.isFeatured || false,
      isNewArrival: data.isNewArrival ?? true,
      colors: data.colors || ['Black'],
      sizes: data.sizes || ['Standard'],
      tags: data.tags || [],
      ...data,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id, data) {
    const index = this.products.findIndex(p => p._id.toString() === id.toString());
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p._id.toString() === id.toString());
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  addReview(productId, review) {
    const product = this.getProductById(productId);
    if (!product) return null;
    product.reviews = product.reviews || [];
    product.reviews.push({
      _id: `rev_${Date.now()}`,
      ...review,
      createdAt: new Date().toISOString()
    });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    return product;
  }

  // User helpers
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id.toString() === id.toString());
  }

  async createUser({ name, email, password, role = 'customer' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Order helpers
  createOrder(orderData) {
    const newOrder = {
      _id: `order_${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...orderData
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getOrdersByUser(userId) {
    return this.orders.filter(o => o.user && o.user.toString() === userId.toString());
  }

  getOrderById(id) {
    return this.orders.find(o => o._id.toString() === id.toString());
  }

  getAllOrders() {
    return this.orders;
  }

  updateOrderStatus(id, status) {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date().toISOString();
    }
    return order;
  }
}

export const mockStore = new MockStore();
