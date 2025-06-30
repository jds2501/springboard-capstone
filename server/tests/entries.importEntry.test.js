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

  test("POST /api/entries/import with invalid markdown should return 400", async () => {
    const invalidMarkdown = `---
            title: Invalid Entry
    ---`;
    const res = await importEntry(server, token, invalidMarkdown);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "There was a problem reading your markdown file. Please make sure it's a valid markdown file with proper front matter formatting."
    );
  });

  test("POST /api/entries/import with missing metadata should return 400", async () => {
    const markdownContent = dedent(`---
      title: 
      date: 
      ---
      This entry has no title or date.
    `);
    const res = await importEntry(server, token, markdownContent);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "The markdown file is missing required information. Please make sure your file includes both a title and date in the front matter (the section between --- at the top of the file)."
    );
  });

  test("POST /api/entries/import with invalid date format should return 400", async () => {
    const markdownContent = dedent(`---
      title: Invalid Date Entry
      date: invalid-date
      ---
      This entry has an invalid date.
    `);
    const res = await importEntry(server, token, markdownContent);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "The date format in your markdown file is invalid. Please use the format YYYY-MM-DD (for example: 2024-03-15) in the front matter."
    );
  });

  test("POST /api/entries/import with file too large should return 400", async () => {
    const largeContent = "a".repeat(2 * 1024 * 1024 + 1); // 2MB + 1 byte
    const markdownContent = createMarkdownContent(
      "Large Entry",
      "2023-06-01",
      largeContent
    );

    const res = await importEntry(server, token, markdownContent);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "The file you selected is too large. Please choose a markdown file that is smaller than 2MB."
    );
  });

  test("POST /api/entries/import without a file should return 400", async () => {
    const res = await request(server)
      .post("/api/entries/import")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Please select a valid markdown file (.md or .markdown extension)."
    );
  });

  test("POST /api/entries/import with file missing title should return 400", async () => {
    const markdownContent = dedent(`---
      date: 2023-06-01
      ---
      This entry has no title.
    `);
    const res = await importEntry(server, token, markdownContent);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "The markdown file is missing required information. Please make sure your file includes both a title and date in the front matter (the section between --- at the top of the file)."
    );
  });

  test("POST /api/entries/import with file missing date should return 400", async () => {
    const markdownContent = dedent(`---
      title: No Date Entry
      ---
      This entry has no date.
    `);
    const res = await importEntry(server, token, markdownContent);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "The markdown file is missing required information. Please make sure your file includes both a title and date in the front matter (the section between --- at the top of the file)."
    );
  });
});
