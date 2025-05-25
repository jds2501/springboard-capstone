const request = require("supertest");

describe('Users API Tests', () => {
    test("GET /api/users for a token that does not exist should return a new user", async () => {
        const res = await request(server)
            .post("/api/users")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(201);
        expect(res.body.isNewUser).toBe(true);
        expect(res.body.id).toBeDefined();
    });

    test("GET /api/users for a token that does exist should return an existing user", async () => {
        await request(server)
            .post("/api/users")
            .set("Authorization", `Bearer ${token}`);

        const res = await request(server)
            .post("/api/users")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.isNewUser).toBe(false);
        expect(res.body.id).toBeDefined();
    });

    test("Multiple GET /api/users for tokens that do not exist should return a new user", async () => {
        await request(server)
            .post("/api/users")
            .set("Authorization", `Bearer ${token}`);

        const diffToken = await getTestToken();
        const res = await request(server)
            .post("/api/users")
            .set("Authorization", `Bearer ${diffToken}`);

        expect(res.statusCode).toBe(201);
        expect(res.body.isNewUser).toBe(true);
        expect(res.body.id).toBeDefined();
    });
});
