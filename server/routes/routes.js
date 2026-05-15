import express from 'express';
import Route from '../models/Route.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Calculate route (will integrate with Google Maps API)
router.post('/calculate', authMiddleware, async (req, res) => {
  try {
    const { emergency, ambulance, startLocation, endLocation } = req.body;

    // Placeholder: will be replaced with actual Google Maps API call
    const route = new Route({
      emergency,
      ambulance,
      startLocation,
      endLocation,
      distance: Math.random() * 20, // Placeholder
      duration: Math.random() * 60,
      eta: new Date(Date.now() + Math.random() * 3600000),
      trafficLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    });

    await route.save();

    res.status(201).json({
      message: 'Route calculated successfully',
      data: route,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get route by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('emergency', 'requestNumber status')
      .populate('ambulance', 'registrationNumber');

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json({
      message: 'Route retrieved successfully',
      data: route,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update route
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { waypoints, trafficLevel, eta } = req.body;

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      {
        waypoints,
        trafficLevel,
        eta,
      },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json({
      message: 'Route updated successfully',
      data: route,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
