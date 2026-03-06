// Inside src/server.js
// ... keep your requires at the top ...

// FIX: This stops the 10-second timeout in Jenkins
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital')
    .then(() => console.log(' Connected to MongoDB!'))
    .catch(err => console.error(' MongoDB error:', err));
}

// ... keep your app.get and app.use routes ...

// FIX: Standardize the export so the test can close the server properly
let server;
if (require.main === module) {
    server = app.listen(PORT, () => {
        console.log(` Hospital Server running on port ${PORT}`);
    });
}
module.exports = { app, server };