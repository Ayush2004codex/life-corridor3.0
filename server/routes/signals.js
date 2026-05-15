import express from 'express';
import TrafficSignal from '../models/TrafficSignal.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all signals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const signals = await TrafficSignal.find({ isActive: true });

    res.json({
      message: 'Traffic signals retrieved successfully',
      data: signals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get signal by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const signal = await TrafficSignal.findById(req.params.id)
      .populate('emergency', 'requestNumber');

    if (!signal) {
      return res.status(404).json({ message: 'Traffic signal not found' });
    }

    res.json({
      message: 'Traffic signal retrieved successfully',
      data: signal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request green corridor (override signal)
router.post('/:id/override', authMiddleware, async (req, res) => {
  try {
    const { emergency, duration } = req.body;

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (duration || 120) * 1000);

    const signal = await TrafficSignal.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          overrideActive: true,
          status: 'green',
          overrideStartTime: startTime,
          overrideEndTime: endTime,
          emergency,
        },
        $push: {
          overrideHistory: {
            emergency,
            startTime,
            endTime,
            duration: duration || 120,
          },
        },
      },
      { new: true }
    );

    if (!signal) {
      return res.status(404).json({ message: 'Traffic signal not found' });
    }

    res.json({
      message: 'Green corridor activated successfully',
      data: signal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get signal override history
router.get('/:id/history', authMiddleware, async (req, res) => {
  try {
    const signal = await TrafficSignal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({ message: 'Traffic signal not found' });
    }

    res.json({
      message: 'Override history retrieved successfully',
      data: signal.overrideHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
