// src/routes/patients.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// GET all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET one patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new patient
router.post('/', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update patient
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE patient
router.delete('/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;