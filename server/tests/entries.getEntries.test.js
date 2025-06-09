const request = require("supertest");

async function addEntries(server, token, numEntries) {
  const entries = [];

  for (let i = 0; i < numEntries; i++) {
    entries.push({
      title: `Test Entry ${i + 1}`,
      date: "2023-02-22",
      description: `Description for entry ${i + 1}`,
    });
  }

  return Promise.all(
    entries.map((entry) =>
      request(server)
        .post("/api/entries")
        .set("Authorization", `Bearer ${token}`)
        .send(entry)
    )
  );
}

describe("Entries Get Entries API Tests", () => {
  beforeEach(async () => {
    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`);
  });

  test("GET /api/entries with no entries present should return a 200", async () => {
    const res = await request(server)
      .get("/api/entries")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries).toEqual([]);
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 20,
      totalPages: 0,
      totalResults: 0,
    });
  });

  test("GET /api/entries with a page that is not a number should return a 400", async () => {
    const res = await request(server)
      .get("/api/entries?page=not-a-number")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  test("GET /api/entries with a limit that is not a number should return a 400", async () => {
    const res = await request(server)
      .get("/api/entries?limit=not-a-number")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  test("GET /api/entries with a page and limit should return paginated results", async () => {
    // Add some entries first
    await addEntries(server, token, 3);

    const res = await request(server)
      .get("/api/entries?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBe(2);
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 2,
      totalPages: 2,
      totalResults: 3,
    });
  });

  test("GET /api/entries with a page that exceeds total pages should return empty entries", async () => {
    // Add some entries first
    await addEntries(server, token, 3);

    const res = await request(server)
      .get("/api/entries?page=3&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBe(0);
    expect(res.body.pagination).toEqual({
      page: 3,
      limit: 2,
      totalPages: 2,
      totalResults: 3,
    });
  });

  test("GET /api/entries with a limit of 0 should report a 400", async () => {
    const res = await request(server)
      .get("/api/entries?limit=0")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  test("GET /api/entries with a limit of 1 should return only one entry", async () => {
    // Add some entries first
    await addEntries(server, token, 3);

    const res = await request(server)
      .get("/api/entries?limit=1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBe(1);
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 1,
      totalPages: 3,
      totalResults: 3,
    });
  });

  test("GET /api/entries with a limit of 1000 should return all entries", async () => {
    // Add some entries first
    await addEntries(server, token, 3);

    const res = await request(server)
      .get("/api/entries?limit=1000")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBe(3);
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 1000,
      totalPages: 1,
      totalResults: 3,
    });
  });

  test("GET /api/entries with a limit of 2 and page 2 should return one entry", async () => {
    // Add some entries first
    await addEntries(server, token, 3);

    const res = await request(server)
      .get("/api/entries?page=2&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBe(1);
    expect(res.body.pagination).toEqual({
      page: 2,
      limit: 2,
      totalPages: 2,
      totalResults: 3,
    });
  });

  test("GET /api/entries with a limit of 2 and page 3 should return no entries", async () => {
    // Add some entries first
    await addEntries(server, token, 3);

    const res = await request(server)
      .get("/api/entries?page=3&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBe(0);
    expect(res.body.pagination).toEqual({
      page: 3,
      limit: 2,
      totalPages: 2,
      totalResults: 3,
    });
  });

  test("GET /api/entries with a limit of 2 and page 1 should return two entries", async () => {
    // Add some entries first
    await addEntries(server, token, 3);

    const res = await request(server)
      .get("/api/entries?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBe(2);
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 2,
      totalPages: 2,
      totalResults: 3,
    });
  });

  test("GET /api/entries with a limit of 2 and page 1 should return two entries with different data", async () => {
    // Add some entries first
    await addEntries(server, token, 3);

    const res = await request(server)
      .get("/api/entries?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.entries.length).toBe(2);
    expect(res.body.entries[0].title).toBeDefined();
    expect(res.body.entries[0].date).toBeDefined();
    expect(res.body.entries[0].description).toBeDefined();
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 2,
      totalPages: 2,
      totalResults: 3,
    });
  });
});
