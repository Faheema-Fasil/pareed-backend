import mongoose from 'mongoose';

const whyChooseUsSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      default: '01',
    },
    title: {
      type: String,
      required: [true, 'Please provide reason title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide reason description'],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const WhyChooseUs = mongoose.model('WhyChooseUs', whyChooseUsSchema);

export default WhyChooseUs;
