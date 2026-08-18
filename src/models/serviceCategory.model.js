import mongoose from 'mongoose';

const serviceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);

export default ServiceCategory;
