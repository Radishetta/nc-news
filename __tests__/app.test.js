const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsFile = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  it("404: ERROR - responds with a 404 error when request an invalid endpoint", () => {
    return request(app)
      .get("/api/topixx")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Not found - Please use /api to see a list of available endpoints"
        );
      });
  });
});

describe("GET /api", () => {
  it("200: responds with an object containing all the endpoints available at the moment", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { availableEndpoints } = body;

        expect(availableEndpoints).toEqual(endpointsFile);
      });
  });
});

describe("GET /api/topics", () => {
  it("200: responds with an array of all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics.length).toBe(3);

        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  it("200: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles.length).toBe(13);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("200: responds with an array sorted by when it was created and descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeSorted("created_at", { descending: true });
      });
  });

  it("200: responds with an array of objects without a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        articles.forEach((article) => {
          expect(article.body).toBeUndefined();
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("200: responds with an article object ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  it("404: ERROR - responds with a 'Article not found' message when given a valid ID that doesnt exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("Article Not Found");
      });
  });

  it("400: ERROR - responds with a 'Bad Request - Invalid ID' message when given an invalid ID", () => {
    return request(app)
      .get("/api/articles/NotAnID")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds with an array of all the comments for the given article_id ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments.length).toBe(11);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });

  it("200: responds with an array sorted by when the comments were created and ascending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toBeSorted("created_at", { descending: false });
      });
  });

  it("200: responds with an empty array if the article_id exists but doesnt have any comment asociated", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toEqual([]);
      });
  });

  it("404: ERROR - responds with an error message if the article doesnt exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("Articles Not Found");
      });
  });

  it("400: ERROR - responds with an error message if the article_id is not valid", () => {
    return request(app)
      .get("/api/articles/invalidID/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;

        expect(msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: responds with the posted comment", () => {
    const newComment = { username: "butter_bridge", body: "Hello this is a test comment" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { newComment } = body;

        expect(newComment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "Hello this is a test comment",
          article_id: 1,
        });
      });
  });

  it("400: ERROR - responds with an error message when passed a malformed comment", () => {
    const newComment = { author: "butter_bridge" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  it("400: ERROR - responds with an error message when passed a comment with an invalid data type", () => {
    const newComment = { author: 9999, body: "Hello this is a test comment" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: responds with the updated article", () => {
    const newUpdate = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;

        expect(updatedArticle).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: "mitch",
          author: "butter_bridge",
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 110,
          article_img_url: expect.any(String),
        });
      });
  });

  it("400: ERROR - responds with an error message when passed a malformed object", () => {
    const newUpdate = {};

    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  it("400: ERROR - responds with an error message when passed an object with invalid data type", () => {
    const newUpdate = { inc_votes: "imAVote" };

    return request(app)
      .patch("/api/articles/1")
      .send(newUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
