const request = require("supertest");

describe('Users API Tests', () => {
    test("GET /api/users should succeed with valid Auth0 token", async () => {
        const res = await request(server)
            .post("/api/users")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});
