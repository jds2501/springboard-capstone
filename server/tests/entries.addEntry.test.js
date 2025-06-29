const request = require("supertest");

const firstEntry = {
  title: "Test Title",
  date: "2023-02-22",
  description: "Test Description",
};

describe("Entries Add Entry API Tests", () => {
  beforeEach(async () => {
    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`);
  });

  test("POST /api/entries without a date, title, and description should return a 400", async () => {
    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test title" })
      .expect(400);

    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({ date: "2023-02-22" })
      .expect(400);

    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title",
        date: "2023-02-22",
      })
      .expect(400);

    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title",
        description: "2023-02-22",
      })
      .expect(400);

    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Test title",
        date: "2023-02-22",
      })
      .expect(400);
  });

  test("POST /api/entries with one invalid change with two valid changes should return a 400", async () => {
    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title",
        date: "invalid",
        description: "2023-02-22",
      })
      .expect(400);

    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title",
        date: "2023-02-22",
        description: "",
      })
      .expect(400);

    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        date: "2023-02-22",
        description: "Test description",
      })
      .expect(400);
  });

  test("POST /api/entries with a valid title, date, and description for a user that does not exist should return a 404", async () => {
    const diffToken = await getTestToken();
    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${diffToken}`)
      .send(firstEntry)
      .expect(404);
  });

  test("POST /api/entries with a valid title, date, and description for a user that exists should return a 201", async () => {
    const res = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(firstEntry.title);
    expect(res.body.date).toBe(new Date(firstEntry.date).toISOString());
    expect(res.body.description).toBe(firstEntry.description);
  });

  test("POST /api/entries with invalid markdown description should return a 400", async () => {
    // Test with whitespace-only markdown
    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title",
        date: "2023-02-22",
        description: "   \n\n\t   ",
      })
      .expect(400);

    // Test with markdown that renders to empty content (just horizontal rule)
    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title",
        date: "2023-02-22",
        description: "---",
      })
      .expect(400);

    // Test with markdown that only contains formatting but no actual content
    await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title",
        date: "2023-02-22",
        description: "**   **",
      })
      .expect(400);
  });

  test("POST /api/entries with valid markdown description should return a 201", async () => {
    // Test with simple text
    let res = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title 1",
        date: "2023-02-22",
        description: "Simple text description",
      });
    expect(res.statusCode).toBe(201);

    // Test with markdown formatting
    res = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title 2",
        date: "2023-02-23",
        description: "**Bold text** and *italic text*",
      });
    expect(res.statusCode).toBe(201);

    // Test with markdown headers and lists
    res = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test title 3",
        date: "2023-02-24",
        description: "# Header\n\n- List item 1\n- List item 2",
      });
    expect(res.statusCode).toBe(201);
  });
});
