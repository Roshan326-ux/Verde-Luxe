import Product from '../models/Product.js';
import { mockStore } from '../config/mockStore.js';
import { getDBStatus } from '../config/db.js';

// @desc    Fetch all products with filtering, search & sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const query = {};

      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let queryBuilder = Product.find(query);

      if (sort === 'price-low') {
        queryBuilder = queryBuilder.sort({ price: 1 });
      } else if (sort === 'price-high') {
        queryBuilder = queryBuilder.sort({ price: -1 });
      } else if (sort === 'rating') {
        queryBuilder = queryBuilder.sort({ rating: -1 });
      } else {
        queryBuilder = queryBuilder.sort({ createdAt: -1 });
      }

      const products = await queryBuilder.exec();
      return res.json({ products, count: products.length, db: 'MongoDB' });
    } else {
      const products = mockStore.getProducts({ category, search, minPrice, maxPrice, sort });
      return res.json({ products, count: products.length, db: 'LocalStore' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    } else {
      const product = mockStore.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    const productData = req.body;

    if (dbStatus.isMongoConnected) {
      const product = new Product({
        ...productData,
        user: req.user._id
      });
      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    } else {
      const createdProduct = mockStore.createProduct(productData);
      return res.status(201).json(createdProduct);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      return res.json(updatedProduct);
    } else {
      const updatedProduct = mockStore.updateProduct(id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(updatedProduct);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      await product.deleteOne();
      return res.json({ message: 'Product removed successfully' });
    } else {
      const success = mockStore.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json({ message: 'Product removed successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.isMongoConnected) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      return res.status(201).json({ message: 'Review added successfully' });
    } else {
      const updatedProduct = mockStore.addReview(id, {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
      });
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(201).json({ message: 'Review added successfully' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
