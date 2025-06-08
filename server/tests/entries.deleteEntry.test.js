const request = require("supertest");

const firstEntry = {
  title: "Test Title",
  date: "2023-02-22",
  description: "Test Description",
};

describe("Entries POST Add Entry API Tests", () => {
  beforeEach(async () => {
    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`);
  });

  test("DELETE /api/entries with an entry ID that is not a number should return a 400", async () => {
    await request(server)
      .delete("/api/entries/dne")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  test("DELETE /api/entries with a numerical entry ID that does not exist should return a 404", async () => {
    await request(server)
      .delete("/api/entries/5")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  test("DELETE /api/entries with a valid entry ID with a user that does not exist should return a 404", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const diffToken = await getTestToken();

    await request(server)
      .delete(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${diffToken}`)
      .expect(404);
  });

  test("DELETE /api/entries with a valid entry ID with a user that does not own the entry should return a 404", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    const diffToken = await getTestToken();

    await request(server)
      .post("/api/users")
      .set("Authorization", `Bearer ${diffToken}`);

    await request(server)
      .delete(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${diffToken}`)
      .expect(404);
  });

  test("DELETE /api/entries with a valid entry ID should return a 200 & no longer have the entry present", async () => {
    const addedEntry = await request(server)
      .post("/api/entries")
      .set("Authorization", `Bearer ${token}`)
      .send(firstEntry);

    await request(server)
      .delete(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    await request(server)
      .get(`/api/entries/${addedEntry.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
