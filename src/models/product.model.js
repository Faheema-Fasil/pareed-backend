import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Please provide badge number'],
      default: '01',
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    sub: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
