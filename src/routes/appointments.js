// src/routes/appointments.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// GET all appointments
// Also fills in patient and doctor full details (populate)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name phone email')   // Get patient name, phone, email
      .populate('doctor', 'name specialization'); // Get doctor name, specialization
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET one appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name phone email')
      .populate('doctor', 'name specialization');
    if (!appointment) return res.status(404).json({ success: false, error: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET appointments by patient ID
// Example: /api/appointments/patient/123
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialization');
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET appointments by doctor ID
// Example: /api/appointments/doctor/456
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId })
      .populate('patient', 'name phone');
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new appointment
router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, error: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH update appointment status only
// Example: /api/appointments/123/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Only allow these 3 status values
    const allowedStatus = ['Scheduled', 'Completed', 'Cancelled'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Status must be Scheduled, Completed, or Cancelled' 
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;