const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, error: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!doctor) return res.status(404).json({ success: false, error: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;