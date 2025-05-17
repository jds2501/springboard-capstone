require('dotenv').config();
const request = require("supertest");
const app = require("../app");
const getTestToken = require("./getTestToken");

describe('Users API Tests', () => {
    let token;

    beforeAll(async () => {
        token = await getTestToken();
    });

    test("GET /api/users should succeed with valid Auth0 token", async () => {
        const res = await request(app)
            .post("/api/users")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});
