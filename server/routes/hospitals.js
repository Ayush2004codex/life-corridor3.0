import express from 'express';
import Hospital from '../models/Hospital.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true })
      .populate('admins', 'name email');
    res.json({
      message: 'Hospitals retrieved successfully',
      data: hospitals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hospital by ID
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .populate('admins', 'name email');

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({
      message: 'Hospital retrieved successfully',
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create hospital (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, location, address, phone, email, beds, departments, admins } = req.body;

    const hospital = new Hospital({
      name,
      location,
      address,
      phone,
      email,
      beds,
      departments,
      admins: admins || [req.user.userId],
    });

    await hospital.save();

    res.status(201).json({
      message: 'Hospital created successfully',
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update hospital (admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { name, location, address, phone, email, beds, departments } = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      {
        name,
        location,
        address,
        phone,
        email,
        beds,
        departments,
      },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({
      message: 'Hospital updated successfully',
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available beds
router.get('/:id/beds', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({
      message: 'Beds retrieved successfully',
      data: {
        total: hospital.beds.total,
        available: hospital.beds.available,
        occupied: hospital.beds.occupied,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update beds
router.put('/:id/beds', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { available, occupied } = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      {
        'beds.available': available,
        'beds.occupied': occupied,
      },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json({
      message: 'Beds updated successfully',
      data: hospital.beds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
