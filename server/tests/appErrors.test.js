const request = require('supertest');

describe('API error handler tests', () => {
    test('Going to a route that does not exist throws a 404 error', async () => {
        await request(server)
            .get('/api/dne')
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    test('Valid post request with disallowed origin', async () => {
        await request(server)
            .post("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .set('Origin', 'https://notallowed.com')
            .expect(403);
    });

    test('Rate limited on the 101th valid request', async () => {
        for (let i = 0; i < 100; i++) {
            await request(server)
                .post("/api/users")
                .set("Authorization", `Bearer ${token}`);
        }

        await request(server)
            .post("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .expect(429);
    });
});