const request = require("supertest");

describe("API Auth Tests", () => {
  test("API routes require authorization", async () => {
    await Promise.all([
      request(server).post("/api/users").expect(401),
      request(server).post("/api/entries").expect(401),
      request(server).patch("/api/entries/1").expect(401),
      request(server).get("/api/entries/1").expect(401),
      request(server).delete("/api/entries/1").expect(401),
    ]);
  });
});
