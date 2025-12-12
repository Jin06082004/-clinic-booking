const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const { doctor, clinic } = req.query;
    let query = {};

    if (doctor) {
      query.doctor = doctor;
    }
    if (clinic) {
      query.clinic = clinic;
    }

    const schedules = await Schedule.find(query)
      .populate('doctor')
      .populate('clinic');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('doctor')
      .populate('clinic');
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new schedule
router.post('/', auth, async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json({ message: 'Schedule created successfully', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update schedule
router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule updated successfully', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete schedule
router.delete('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
