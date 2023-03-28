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
});

describe("/api/reviews/:review_id", () => {
  it(`'GET 200: Should return a review object, which should have the following properties: 
  review_id'title','review_body','designer','review_img_url','votes','category','owner','created_at'`, () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  it("GET 400: Should return bad request if request isn't vaild", () => {
    return request(app)
      .get("/api/reviews/dogs")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  it("GET 404: Should return a 404 error is the ID is not found", () => {
    return request(app)
      .get("/api/reviews/20")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ status: 404, msg: "Review not found" });
      });
  });
});

describe("404", () => {
  it(": should return 404 if the url is invalid", () => {
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
