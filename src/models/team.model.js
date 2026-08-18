import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide team member name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide member role'],
      trim: true,
    },
    initials: {
      type: String,
      default: '',
      trim: true,
    },
    photo: {
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

// Pre-save to calculate initials if empty
teamMemberSchema.pre('save', function () {
  if (!this.initials && this.name) {
    this.initials = this.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
