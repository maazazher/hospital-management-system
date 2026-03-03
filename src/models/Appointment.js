// src/models/Appointment.js
const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
patient: {
type: mongoose.Schema.Types.ObjectId, // Links to Patient
ref: 'Patient',
required: true
},
doctor: {
type: mongoose.Schema.Types.ObjectId, // Links to Doctor
ref: 'Doctor',
required: true
},
date: { type: Date, required: true },
time: { type: String, required: true },
reason: String,
status: {
type: String,
enum: ['Scheduled', 'Completed', 'Cancelled'],
default: 'Scheduled'
},
notes: String,
createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Appointment', appointmentSchema);