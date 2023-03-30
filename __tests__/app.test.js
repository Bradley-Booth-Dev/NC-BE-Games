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
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
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

describe("/api/reviews", () => {
  it(`GET 200: should return an array of review objects which should have the following properties:
  'owner','title','review_id','category','review_img_url','created_at','votes','designer','comment_count'`, () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  it("GET200: reviews should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  it(`should return  an array of comments for the given review_id of which each comment should have the following properties:
  'comment_id','votes','created_at','author','body','review_id'`, () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        console.log(body, "TEST");
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
