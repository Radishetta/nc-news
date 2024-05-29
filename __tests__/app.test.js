const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsFile = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  it("404: responds with a 404 error when request an invalid endpoint", () => {
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

  it("404: responds with a 'ID not found' message when given a valid ID that doesnt exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("ID not found");
      });
  });

  it("400: responds with a 'Bad Request - Invalid ID' message when given an invalid ID", () => {
    return request(app)
      .get("/api/articles/NotAnID")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request - Invalid ID");
      });
  });
});
