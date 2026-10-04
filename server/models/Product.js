import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Shoes', 'Watches', 'Accessories', 'New Arrivals']
    },
    description: {
      type: String,
      required: true
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    colors: [
      {
        type: String
      }
    ],
    sizes: [
      {
        type: String
      }
    ],
    tags: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
