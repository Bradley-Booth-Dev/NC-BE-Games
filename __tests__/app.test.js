const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require(".././db/data/test-data/index");

beforeEach(() => seed(testData));

describe("/api", () => {
  it("GET 200: should return message saying all okay.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("all ok");
      });
  });
});

describe("/api/categories", () => {
  it(`GET 200: Should return an array of objects, each of which
   should have the 'slug' and 'description' properties`, () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  it("GET 404: Should respond with a 404 error if the url is invalid ", () => {
    return request(app)
      .get("/*")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

afterAll(() => {
  db.end();
});
