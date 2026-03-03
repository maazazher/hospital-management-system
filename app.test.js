// tests/app.test.js
const request = require('supertest');
const { app, server } = require('../src/server');
// Clean up after all tests are done
afterAll(done => {
server.close(done);
});
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
it('GET /api/patients should return array', async () => {
const response = await request(app).get('/api/patients');
expect(response.status).toBe(200);
expect(response.body.success).toBe(true);
});
});
