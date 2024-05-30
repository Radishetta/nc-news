const express = require("express");
const { getUsers } = require("./controllers/users.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/api.controller");
const { getArticleById, getArticles, patchArticle } = require("./controllers/articles.controller");
const { getComment, postComment, deleteComment } = require("./controllers/comments.controller");
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
app.get("/api/users", getUsers);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComment);

// POST
app.post("/api/articles/:article_id/comments", postComment);

// PATCH
app.patch("/api/articles/:article_id", patchArticle);

// DELETE
app.delete("/api/comments/:comment_id", deleteComment);

//ERROR HANDLING
app.all("/*", handleInvalidEndpoint);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
