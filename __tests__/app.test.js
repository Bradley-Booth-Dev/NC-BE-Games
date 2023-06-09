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
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual([
          {
            path: "/api",
            method: "GET",
            description: "Returns a message to check if the API is working",
          },
          {
            path: "/api/categories",
            method: "GET",
            description: "Returns all the categories",
          },
          {
            path: "/api/reviews/:review_id",
            method: "GET",
            description: "Returns the review with the specified ID",
          },
          {
            path: "/api/reviews",
            method: "GET",
            description: "Returns all the reviews",
          },
          {
            path: "/api/reviews/:review_id/comments",
            method: "GET",
            description: "Returns all the comments for the specified review",
          },
          {
            path: "/api/reviews/:review_id/comments",
            method: "POST",
            description: "Adds a new comment to the specified review",
          },
          {
            path: "/api/reviews/:review_id",
            method: "PATCH",
            description: "Updates the specified review",
          },
          {
            path: "/api/comments/:comment_id",
            method: "DELETE",
            description: "Deletes the specified comment",
          },
          {
            path: "/api/users",
            method: "GET",
            description: "Returns all the users",
          },
        ]);
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
  it("GET 200: Should return a review object with comment_count field", () => {
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
          comment_count: expect.any(Number),
        });
      });
  });
  it("GET 400: Should return bad request if request isn't valid", () => {
    return request(app)
      .get("/api/reviews/dogs")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 404,
          msg: "Bad request",
        });
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
  it("GET 200: reviews should be sorted by date in descending order as default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("GET 200: reviews should be sorted by date in ascending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  it("GET 200: reviews should be sorted by category in descending order as default", () => {
    return request(app)
      .get("/api/reviews?sort_by=category")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("category", {
          descending: true,
        });
      });
  });
  it("GET 200", () => {
    return request(app)
      .get("/api/reviews?sort_by=category&order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("category", {
          descending: false,
        });
      });
  });
  it("GET 200: Should return in descending order by default if sort order isn't valid", () => {
    return request(app)
      .get("/api/reviews?sort_by=category&order=dogs")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("category", {
          descending: true,
        });
      });
  });
  it("GET 400: Should return bad request if query isn't valid", () => {
    return request(app)
      .get("/api/reviews/reviews?sort_by=dogs")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 404,
          msg: "Bad request",
        });
      });
  });
  it("GET 400: Should return bad request if request isn't valid", () => {
    return request(app)
      .get("/api/reviews/dogs")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 404,
          msg: "Bad request",
        });
      });
  });
});

//ADD querey tests

describe("/api/reviews/:review_id/comments", () => {
  it(`GET 200: should return  an array of comments for the given review_id of which each comment should have the following properties:
  'comment_id','votes','created_at','author','body','review_id'`, () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
      });
  });
  it("GET 200: Should be with the most recent comments first ", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("GET 200: Should return a 200 with an empty array if there are no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  it("GET 400: Should return bad request if request isn't valid", () => {
    return request(app)
      .get("/api/reviews/dogs")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 404,
          msg: "Bad request",
        });
      });
  });
  it("GET 404: returns 404 if review doesnt exist", () => {
    return request(app)
      .get("/api/reviews/20")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ status: 404, msg: "Review not found" });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  it("POST 201: should return posted comment", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "bainesface",
        body: "This is the best board game ever",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          username: "bainesface",
          body: "This is the best board game ever",
        });
      });
  });
  it("POST 201 should respond with a 201 ignoring any extra data given", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "bainesface",
        body: "This is the best board game ever",
        bonusKey: "DROP TABLES",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          username: "bainesface",
          body: "This is the best board game ever",
        });
      });
  });
  it("POST 404:should return a 404 if the review doesnt exist", () => {
    return request(app)
      .post("/api/reviews/99999/comments")
      .send({
        username: "bainesface",
        body: "This is the best board game ever",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ status: 404, msg: "Review not found" });
      });
  });
  it("POST 404: should return a 404 when given username not in table ", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "fullenglish3",
        body: "This game is awesome!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ status: 404, msg: "Username not found" });
      });
  });
  it("POST 400 should respond with an error when missing information e.g body", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "bainesface" })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 400,
          msg: "Comment body is missing",
        });
      });
  });
  it("POST 400: responds with error when given a bad review id", () => {
    return request(app)
      .post("/api/reviews/notAnId/comments")
      .send({
        username: "bainesface",
        body: "This is the best board game ever",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ status: 404, msg: "Bad request" });
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  it("PATCH 200: should return an object with updated votes", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: 11 })
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 4,
          title: "Dolor reprehenderit",
          category: "social deduction",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
          created_at: "2021-01-22T11:35:50.936Z",
          votes: 18,
        });
      });
  });
  it("PATCH 200: should return an object with updated subtracted votes", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 4,
          title: "Dolor reprehenderit",
          category: "social deduction",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
          created_at: "2021-01-22T11:35:50.936Z",
          votes: -3,
        });
      });
  });
  it("PATCH 200: should update the votes even when given unnecessary data", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: 11, bonus_key: "Delete All" })
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 4,
          title: "Dolor reprehenderit",
          category: "social deduction",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
          created_at: "2021-01-22T11:35:50.936Z",
          votes: 18,
        });
      });
  });
  it("PATCH 400: should return an error when given wrong information type", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: "Eleven" })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ status: 404, msg: "Bad request" });
      });
  });
  it("PATCH 400: should return an error when given invalid ID", () => {
    return request(app)
      .patch("/api/reviews/notAnId")
      .send({ inc_votes: 11 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ status: 404, msg: "Bad request" });
      });
  });
  it("POST 404:should return a 404 if the review doesnt exist", () => {
    return request(app)
      .patch("/api/reviews/9999")
      .send({ inc_votes: 7 })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ status: 404, msg: "Review not found" });
      });
  });
});

describe("DELETE /api/comments/:comment_id ", () => {
  it("DELETE 204: should delete the comment and return no content ", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  it("DELETE 404: return error if comment doesnt exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 404,
          msg: "Comment not found",
        });
      });
  });
  it("DELETE 400: return error if given incorrect comment_ID", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 404,
          msg: "Bad request",
        });
      });
  });
});

describe("GET /api/users", () => {
  it(`GET 200: should responds with: an array of objects, each object should have the following property:
  'username','name','avatar_url'`, () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  it("GET 400: Should return bad request if request isn't valid", () => {
    return request(app)
      .get("/api/reviews/dogs")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          status: 404,
          msg: "Bad request",
        });
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
