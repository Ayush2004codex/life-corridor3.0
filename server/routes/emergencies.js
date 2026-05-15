import express from 'express';
import Emergency from '../models/Emergency.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create emergency request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, priority, patientName, pickupLocation, destinationHospital } = req.body;

    const emergency = new Emergency({
      type,
      priority,
      patientName,
      pickupLocation,
      destinationHospital,
      requestTime: new Date(),
    });

    await emergency.save();

    res.status(201).json({
      message: 'Emergency request created successfully',
      data: emergency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all emergencies (filtered by role)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};

    // Drivers see only their own emergencies
    if (req.user.role === 'driver') {
      query.driver = req.user.userId;
    }

    const emergencies = await Emergency.find(query)
      .populate('ambulance', 'registrationNumber')
      .populate('hospital', 'name address')
      .populate('driver', 'name phone')
      .populate('destinationHospital', 'name address')
      .sort({ requestTime: -1 });

    res.json({
      message: 'Emergencies retrieved successfully',
      data: emergencies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get emergency by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('ambulance')
      .populate('hospital', 'name address location')
      .populate('driver', 'name phone')
      .populate('destinationHospital', 'name address location beds');

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    res.json({
      message: 'Emergency retrieved successfully',
      data: emergency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update emergency status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['requested', 'accepted', 'en-route', 'arrived', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };

    // Auto-populate time fields based on status
    if (status === 'accepted') {
      updateData.acceptedTime = new Date();
    } else if (status === 'en-route') {
      updateData.pickupTime = new Date();
    } else if (status === 'arrived') {
      updateData.arrivalTime = new Date();
    } else if (status === 'completed') {
      updateData.completionTime = new Date();
    }

    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    res.json({
      message: 'Emergency status updated successfully',
      data: emergency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Driver accept emergency
router.put('/:id/accept', authMiddleware, roleMiddleware(['driver']), async (req, res) => {
  try {
    const { ambulanceId } = req.body;

    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        status: 'accepted',
        driver: req.user.userId,
        ambulance: ambulanceId,
        acceptedTime: new Date(),
      },
      { new: true }
    );

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    res.json({
      message: 'Emergency accepted successfully',
      data: emergency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
