const request = require("supertest");
const app = require("../src/server");

describe("Express app endpoints", () => {

  test("GET / should return home message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Welcome to the Home page!");
  });

  test("GET /profile should return profile info", async () => {
    const res = await request(app).get("/profile");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      name: "Omar",
      role: "Cloud & DevOps Student"
    });
  });

});
