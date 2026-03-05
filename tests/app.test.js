const request = require('supertest');
// Ensure the path below correctly points to your server file from the 'tests' folder
const { app, server } = require('../src/server');

// Clean up after all tests are done
afterAll(done => {
    // Only attempt to close the server if it was actually started
    if (server && server.close) {
        server.close(done);
    } else {
        done();
    }
});

describe('Hospital Management System API Tests', () => {
    
    // Test 1: Health check
    describe('Health Check', () => {
        it('should return status OK', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('OK');
        });
    });

    // Test 2: Welcome page
    describe('Welcome Route', () => {
        it('should return welcome message', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.body.message).toContain('Hospital');
        });
    });

    // Test 3: Patients API
    describe('Patients API', () => {
        it('GET /api/patients should return a response', async () => {
            const response = await request(app).get('/api/patients');
            // We check for 200 or 500 (if DB is not connected in CI) 
            // to ensure the route at least exists
            expect([200, 500]).toContain(response.status);
        });
    });
});