const articlesRouter = require("express").Router();
const { getArticleById, patchArticle, getArticles } = require("../controllers/articles.controller");
const { getComment, postComment } = require("../controllers/comments.controller");

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter.route("/:article_id/comments").get(getComment).post(postComment);

module.exports = articlesRouter;
