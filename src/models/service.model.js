import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Please provide badge number'],
      default: '01',
    },
    title: {
      type: String,
      required: [true, 'Please provide service title'],
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

const Service = mongoose.model('Service', serviceSchema);

export default Service;
