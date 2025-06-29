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

  test("POST /api/entries/trend with invalid date format should return a 400", async () => {
    await request(server)
      .post("/api/entries/trend")
      .set("Authorization", `Bearer ${token}`)
      .send({
        from: "invalid-date",
        to: "2023-12-31",
      })
      .expect(400);

    await request(server)
      .post("/api/entries/trend")
      .set("Authorization", `Bearer ${token}`)
      .send({
        from: "2023-01-01",
        to: "invalid-date",
      })
      .expect(400);
  });

  test("POST /api/entries/trend with entries in range should return a 200 with analysis", async () => {
    // First, create some entries in the database
    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Entry 1",
        date: "2023-01-15",
        description: "This is a test entry.",
      });

    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Entry 2",
        date: "2023-02-20",
        description: "This is another test entry.",
      });

    const response = await request(server)
      .post("/api/entries/trend")
      .set("Authorization", `Bearer ${token}`)
      .send({
        from: "2023-01-01",
        to: "2023-12-31",
      })
      .expect(200);

    expect(response.body).toHaveProperty("analysis");
    expect(response.body.analysis).not.toBe("No entries found for this range.");
  }, 30000); // 30 second timeout for AI processing
});
