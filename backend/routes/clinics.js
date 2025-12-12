const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const auth = require('../middleware/auth');

// Get all clinics
router.get('/', async (req, res) => {
  try {
    const { city, specialty } = req.query;
    let query = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (specialty) {
      query.specialties = { $regex: specialty, $options: 'i' };
    }

    const clinics = await Clinic.find(query).sort({ rating: -1 });
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single clinic by ID
router.get('/:id', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new clinic (admin only - simplified for this project)
router.post('/', auth, async (req, res) => {
  try {
    const clinic = new Clinic(req.body);
    await clinic.save();
    res.status(201).json({ message: 'Clinic created successfully', clinic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update clinic
router.put('/:id', auth, async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json({ message: 'Clinic updated successfully', clinic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete clinic
router.delete('/:id', auth, async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
