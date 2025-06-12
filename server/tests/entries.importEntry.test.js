const request = require("supertest");
const dedent = require("dedent");

describe("Entries Import Entry API Tests", () => {
  beforeEach(async () => {
    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`);
  });

  test("POST /api/entries/import without a file should return 400", async () => {
    await request(server)
      .post("/api/entries/import")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  test("POST /api/entries/import with a file should return 201", async () => {
    const markdownContent = dedent(`---
        title: Test Entry
        date: 2023-06-01
        ---
        
        This is the body of the test entry.
        `);

    const res = await request(server)
      .post("/api/entries/import")
      .set("Authorization", `Bearer ${token}`)
      .attach(
        "file",
        Buffer.from(markdownContent, "utf-8"),
        "imported-entry.md"
      );
    console.log(res.body);
    expect(res.statusCode).toBe(201);
  });
});
