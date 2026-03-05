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

// Only connect to MongoDB if NOT in test mode to prevent CI timeouts
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital')
    .then(() => console.log(' Connected to MongoDB!'))
    .catch(err => console.error(' MongoDB error:', err));
}

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Hospital Management System is running!' });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Hospital Management System API',
        version: '1.0.0',
        endpoints: { patients: '/api/patients', doctors: '/api/doctors', appointments: '/api/appointments' }
    });
});

app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// FIX: Only start the listener if this file is run directly
let server;
if (require.main === module) {
    server = app.listen(PORT, () => {
        console.log(` Hospital Server running on port ${PORT}`);
    });
}

module.exports = { app, server };