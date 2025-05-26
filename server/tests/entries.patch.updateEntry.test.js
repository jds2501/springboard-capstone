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
});
