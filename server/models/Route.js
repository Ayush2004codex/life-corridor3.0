import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    emergency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emergency',
      required: true,
    },
    ambulance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance',
    },
    startLocation: {
      latitude: Number,
      longitude: Number,
    },
    endLocation: {
      latitude: Number,
      longitude: Number,
    },
    waypoints: [
      {
        latitude: Number,
        longitude: Number,
        order: Number,
      },
    ],
    distance: Number,
    duration: Number,
    eta: Date,
    polyline: String,
    trafficLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    alternateRoutes: [
      {
        distance: Number,
        duration: Number,
        polyline: String,
      },
    ],
    turnByTurnInstructions: [
      {
        instruction: String,
        distance: Number,
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

export default mongoose.model('Route', routeSchema);
