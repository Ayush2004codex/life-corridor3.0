import express from 'express';
import Ambulance from '../models/Ambulance.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all ambulances
router.get('/', authMiddleware, async (req, res) => {
  try {
    const ambulances = await Ambulance.find({ isActive: true })
      .populate('hospital', 'name')
      .populate('driver', 'name phone');

    res.json({
      message: 'Ambulances retrieved successfully',
      data: ambulances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available ambulances
router.get('/available', authMiddleware, async (req, res) => {
  try {
    const ambulances = await Ambulance.find({
      status: 'available',
      isActive: true
    })
      .populate('hospital', 'name')
      .populate('driver', 'name phone');

    res.json({
      message: 'Available ambulances retrieved successfully',
      data: ambulances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ambulance by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id)
      .populate('hospital', 'name address location')
      .populate('driver', 'name phone email');

    if (!ambulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }

    res.json({
      message: 'Ambulance retrieved successfully',
      data: ambulance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create ambulance (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { registrationNumber, hospital, driver, equipment } = req.body;

    const ambulance = new Ambulance({
      registrationNumber,
      hospital,
      driver,
      equipment,
    });

    await ambulance.save();

    res.status(201).json({
      message: 'Ambulance created successfully',
      data: ambulance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update ambulance location
router.put('/:id/location', authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      {
        'currentLocation.latitude': latitude,
        'currentLocation.longitude': longitude,
        'currentLocation.address': address,
        'currentLocation.updatedAt': new Date(),
      },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }

    res.json({
      message: 'Location updated successfully',
      data: ambulance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update ambulance status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['available', 'busy', 'offline', 'maintenance'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({ message: 'Ambulance not found' });
    }

    res.json({
      message: 'Status updated successfully',
      data: ambulance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
