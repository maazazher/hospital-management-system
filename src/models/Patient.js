// src/models/Patient.js
const mongoose = require('mongoose');
// Define what a Patient looks like in the database
const patientSchema = new mongoose.Schema({
name: {
type: String,
required: true, // This field is mandatory
trim: true // Remove extra spaces
},
age: {
type: Number,
required: true
},
gender: {
type: String,
enum: ['Male', 'Female', 'Other'], // Only these 3 values allowed
required: true
},
phone: {
type: String,
required: true
},
email: {
type: String,
unique: true // No two patients can have same email
},
address: String,
bloodGroup: String,
medicalHistory: [String], // A list of past conditions
registeredAt: {
type: Date,
default: Date.now // Automatically set to current date
}
});
// Export the model so other files can use it
module.exports = mongoose.model('Patient', patientSchema);