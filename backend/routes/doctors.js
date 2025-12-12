const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { clinic, specialty } = req.query;
    let query = {};

    if (clinic) {
      query.clinic = clinic;
    }
    if (specialty) {
      query.specialty = { $regex: specialty, $options: 'i' };
    }

    const doctors = await Doctor.find(query).populate('clinic').sort({ rating: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('clinic');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new doctor
router.post('/', auth, async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update doctor
router.put('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete doctor
router.delete('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
