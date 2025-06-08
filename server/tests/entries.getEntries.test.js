const request = require("supertest");

describe("Entries Get Entries API Tests", () => {
  beforeEach(async () => {
    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`);
  });

  test("GET /api/entries with no entries present that is not a number should return a 200", async () => {
    const res = await request(server)
      .get("/api/entries")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
