import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
    },
    ambulance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance',
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['heart-attack', 'accident', 'burn', 'stroke', 'trauma', 'other'],
      required: [true, 'Emergency type is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
    },
    pickupLocation: {
      latitude: {
        type: Number,
        required: [true, 'Pickup latitude is required'],
      },
      longitude: {
        type: Number,
        required: [true, 'Pickup longitude is required'],
      },
      address: String,
    },
    destinationHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Destination hospital is required'],
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'en-route', 'arrived', 'completed', 'cancelled'],
      default: 'requested',
    },
    requestTime: {
      type: Date,
      default: Date.now,
    },
    acceptedTime: Date,
    pickupTime: Date,
    arrivalTime: Date,
    completionTime: Date,
    distance: Number,
    duration: Number,
    eta: Date,
    notes: String,
    symptoms: String,
    requiredEquipment: [String],
  },
  { timestamps: true }
);

// Auto-generate request number
emergencySchema.pre('save', async function (next) {
  if (this.isNew && !this.requestNumber) {
    const count = await this.constructor.countDocuments();
    this.requestNumber = `EM-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model('Emergency', emergencySchema);
