import mongoose from 'mongoose';

const ambulanceSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital is required'],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline', 'maintenance'],
      default: 'available',
    },
    currentLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    lastMaintenance: Date,
    nextMaintenanceDue: Date,
    equipment: [String],
    capacity: {
      type: Number,
      default: 4,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Ambulance', ambulanceSchema);
