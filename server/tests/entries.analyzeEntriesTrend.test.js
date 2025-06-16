const request = require("supertest");

describe("Entries Analyze Entries Trend API Tests", () => {
  beforeEach(async () => {
    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`);
  });

  test("POST /api/entries/trend with valid data should return a 200", async () => {
    const response = await request(server)
      .post("/api/entries/trend")
      .set("Authorization", `Bearer ${token}`)
      .send({
        from: "2023-01-01",
        to: "2023-12-31",
      })
      .expect(200);

    expect(response.body).toHaveProperty("analysis");
    expect(response.body.analysis).toBe("No entries found for this range.");
  });

  test("POST /api/entries/trend without from and to dates should return a 400", async () => {
    await request(server)
      .post("/api/entries/trend")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    await request(server)
      .post("/api/entries/trend")
      .set("Authorization", `Bearer ${token}`)
      .send({ from: "2023-01-01" })
      .expect(400);

    await request(server)
      .post("/api/entries/trend")
      .set("Authorization", `Bearer ${token}`)
      .send({ to: "2023-12-31" })
      .expect(400);
  });
});
