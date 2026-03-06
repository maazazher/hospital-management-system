// src/server.js — Main entry point
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital', {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB!'))
.catch(err => console.error(' MongoDB error:', err));
// Health check endpoint
app.get('/health', (req, res) => {
res.json({ status: 'OK', message: 'Hospital Management System is running!' });
});
// Welcome route
app.get('/', (req, res) => {
res.json({
message: 'Welcome to Hospital Management System API',
version: '1.0.0',
endpoints: {
patients: '/api/patients',
doctors: '/api/doctors',
appointments: '/api/appointments'
}
});
});
// Register routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
const server = app.listen(PORT, () => {
console.log(` Hospital Server running on port ${PORT}`);
});
module.exports = { app, server };
