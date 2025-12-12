const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Get all bookings (admin) or user's bookings
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Regular users can only see their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('user', '-password')
      .populate('clinic')
      .populate('doctor')
      .sort({ date: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', '-password')
      .populate('clinic')
      .populate('doctor');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Users can only view their own bookings
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user._id
    });
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', '-password')
      .populate('clinic')
      .populate('doctor');
    
    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking: populatedBooking 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Users can only update their own bookings
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('user', '-password')
      .populate('clinic')
      .populate('doctor');

    res.json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Users can only cancel their own bookings
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
