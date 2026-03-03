// src/models/Doctor.js
const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true },
specialization: {
type: String,
required: true,
// e.g., Cardiology, Neurology, Orthopedics
},
phone: { type: String, required: true },
email: { type: String, unique: true },
experience: Number, // Years of experience
available: {
type: Boolean,
default: true // Available by default
},
schedule: {
days: [String], // e.g., ['Monday', 'Wednesday', 'Friday']
startTime: String, // e.g., '09:00'
endTime: String // e.g., '17:00'
}
});
module.exports = mongoose.model('Doctor', doctorSchema);