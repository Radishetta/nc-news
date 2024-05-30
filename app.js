const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
const { getArticleById, getArticles, patchArticles } = require("./controllers/articles.controller");
const { getComments, postComments } = require("./controllers/comments.controller");
const {
  handleInvalidEndpoint,
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./errors/index");

const app = express();
app.use(express.json());

// GET
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);

// POST
app.post("/api/articles/:article_id/comments", postComments);

// PATCH
app.patch("/api/articles/:article_id", patchArticles);

//ERROR HANDLING
app.all("/*", handleInvalidEndpoint);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
