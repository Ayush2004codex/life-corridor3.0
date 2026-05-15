import mongoose from 'mongoose';

const trafficSignalSchema = new mongoose.Schema(
  {
    signalNumber: {
      type: String,
      unique: true,
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: String,
    },
    status: {
      type: String,
      enum: ['red', 'yellow', 'green'],
      default: 'red',
    },
    overrideActive: {
      type: Boolean,
      default: false,
    },
    overrideStartTime: Date,
    overrideEndTime: Date,
    overrideDuration: {
      type: Number,
      default: 120,
    },
    emergency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emergency',
    },
    overrideHistory: [
      {
        emergency: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Emergency',
        },
        startTime: Date,
        endTime: Date,
        duration: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('TrafficSignal', trafficSignalSchema);
