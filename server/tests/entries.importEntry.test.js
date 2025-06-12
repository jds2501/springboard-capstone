const request = require("supertest");
const dedent = require("dedent");

function createMarkdownContent(title, date, body) {
  const isoDate = new Date(date).toISOString();

  return dedent(`---
    title: ${title}
    date: ${isoDate}
    ---
    ${body}
  `);
}

async function importEntry(server, token, markdownContent) {
  return request(server)
    .post("/api/entries/import")
    .set("Authorization", `Bearer ${token}`)
    .attach("file", Buffer.from(markdownContent, "utf-8"), "imported-entry.md");
}

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
    const title = "Test Entry";
    const date = new Date("2023-06-01");
    const body = "This is the body of the test entry.";

    const markdownContent = createMarkdownContent(title, date, body);
    const res = await importEntry(server, token, markdownContent);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", title);
    expect(res.body).toHaveProperty("date", date.toISOString());
    expect(res.body).toHaveProperty("description", body);
    expect(res.body).toHaveProperty("user_id");
    expect(res.body.user_id).toBeDefined();
    expect(res.body).toHaveProperty("created_at");
    expect(res.body).toHaveProperty("updated_at", null);
  });
});
