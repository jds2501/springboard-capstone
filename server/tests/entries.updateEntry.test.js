const request = require("supertest");

const firstEntry = {
  title: "Test Title",
  date: "2023-02-22",
  description: "Test Description",
};

describe("Entries Update Entry API Tests", () => {
  beforeEach(async () => {
    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`);
  });

  test("PATCH /api/entries with an entry ID that is not a number should return a 400", async () => {
    await request(server)
      .patch("/api/entries/dne")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Diff" })
      .expect(400);
  });

  test("PATCH /api/entries with a numerical entry ID that does not exist should return a 404", async () => {
    await request(server)
      .patch("/api/entries/5")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Diff" })
      .expect(404);
  });

  test("PATCH /api/entries with a valid entry ID with no changes should return a 204", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  test("PATCH /api/entries with a valid entry ID with invalid changes should return a 400", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ date: "dne" })
      .expect(400);

    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "" })
      .expect(400);

    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "" })
      .expect(400);
  });

  test("PATCH /api/entries with a valid entry ID with a user that does not exist should return a 404", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const diffToken = await getTestToken();

    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${diffToken}`)
      .expect(404);
  });

  test("PATCH /api/entries with a valid entry ID with a user that does not own the entry should return a 404", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const diffToken = await getTestToken();

    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${diffToken}`);

    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${diffToken}`)
      .send({ title: "Change" })
      .expect(404);
  });

  test("PATCH /api/entries with a valid entry ID with valid title change should return a 200", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const newTitle = "New title";

    const res = await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: newTitle });

    expect(res.statusCode).toBe(200);
    expect(res.body.entry.title).toBe(newTitle);
    expect(res.body.entry.date).toBe(new Date(firstEntry.date).toISOString());
    expect(res.body.entry.description).toBe(firstEntry.description);
  });

  test("PATCH /api/entries with a valid entry ID with valid description change should return a 200", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const newDescription = "New description";

    const res = await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: newDescription });

    expect(res.statusCode).toBe(200);
    expect(res.body.entry.title).toBe(firstEntry.title);
    expect(res.body.entry.date).toBe(new Date(firstEntry.date).toISOString());
    expect(res.body.entry.description).toBe(newDescription);
  });

  test("PATCH /api/entries with a valid entry ID with valid date change should return a 200", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const newDate = "2025-01-01";

    const res = await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ date: newDate });

    expect(res.statusCode).toBe(200);
    expect(res.body.entry.title).toBe(firstEntry.title);
    expect(res.body.entry.date).toBe(new Date(newDate).toISOString());
    expect(res.body.entry.description).toBe(firstEntry.description);
  });

  test("PATCH /api/entries with a valid entry ID with valid title and date change should return a 200", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const newTitle = "New title";
    const newDate = "2025-01-01";

    const res = await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ date: newDate, title: newTitle });

    expect(res.statusCode).toBe(200);
    expect(res.body.entry.title).toBe(newTitle);
    expect(res.body.entry.date).toBe(new Date(newDate).toISOString());
    expect(res.body.entry.description).toBe(firstEntry.description);
  });

  test("PATCH /api/entries with a valid entry ID with valid title, description, and date change should return a 200", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const newTitle = "New title";
    const newDate = "2025-01-01";
    const newDescription = "New description";

    const res = await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ date: newDate, title: newTitle, description: newDescription });

    expect(res.statusCode).toBe(200);
    expect(res.body.entry.title).toBe(newTitle);
    expect(res.body.entry.date).toBe(new Date(newDate).toISOString());
    expect(res.body.entry.description).toBe(newDescription);
  });

  test("PATCH /api/entries with invalid markdown description should return a 400", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    // Test with whitespace-only markdown
    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "   \n\n\t   " })
      .expect(400);

    // Test with markdown that renders to empty content (just horizontal rule)
    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "---" })
      .expect(400);

    // Test with markdown that only contains formatting but no actual content
    await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "**   **" })
      .expect(400);
  });

  test("PATCH /api/entries with valid markdown description should return a 200", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    // Test with simple text
    let res = await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated simple text description" });
    expect(res.statusCode).toBe(200);
    expect(res.body.entry.description).toBe("Updated simple text description");

    // Test with markdown formatting
    res = await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "**Bold text** and *italic text*" });
    expect(res.statusCode).toBe(200);
    expect(res.body.entry.description).toBe("**Bold text** and *italic text*");

    // Test with markdown headers and lists
    res = await request(server)
      .patch(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "# Updated Header\n\n- Updated item 1\n- Updated item 2",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.entry.description).toBe(
      "# Updated Header\n\n- Updated item 1\n- Updated item 2"
    );
  });
});
