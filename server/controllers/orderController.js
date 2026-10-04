import Order from '../models/Order.js';
import { mockStore } from '../config/mockStore.js';
import { getDBStatus } from '../config/db.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Optional Auth
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      customerName,
      customerEmail
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    const dbStatus = getDBStatus();

    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice || 0),
      shippingPrice: Number(shippingPrice || 0),
      totalPrice: Number(totalPrice),
      customerName: customerName || (req.user ? req.user.name : 'Guest Customer'),
      customerEmail: customerEmail || (req.user ? req.user.email : 'guest@example.com'),
      user: req.user ? req.user._id : null,
      isPaid: paymentMethod !== 'Cash on Delivery',
      paidAt: paymentMethod !== 'Cash on Delivery' ? new Date() : null,
      status: 'Pending'
    };

    if (dbStatus.isMongoConnected) {
      const order = new Order(orderData);
      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    } else {
      const createdOrder = mockStore.createOrder(orderData);
      return res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = mockStore.getOrdersByUser(req.user._id);
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public / Private
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const order = await Order.findById(id).populate('user', 'name email');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.json(order);
    } else {
      const order = mockStore.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = mockStore.getAllOrders();
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    } else {
      const updatedOrder = mockStore.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.json(updatedOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
