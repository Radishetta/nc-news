const { fetchCommentsByArticleId, createComment } = require("../models/comments.model");
const { checkArticleExists } = require("../models/articles.model");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [fetchCommentsByArticleId(article_id)];

  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  createComment(newComment, article_id)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};
