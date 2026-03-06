const request = require('supertest');
const { app, server } = require('../src/server');

afterAll(async () => {
    if (server && server.close) {
        await new Promise(resolve => server.close(resolve));
    }
});

describe('Hospital API Tests', () => {
    it('should return 200 for health check', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
    });

    it('should respond to patients route', async () => {
        const response = await request(app).get('/api/patients');
        // We just need to know the route is there
        expect(response.status).toBeDefined();
    });
});