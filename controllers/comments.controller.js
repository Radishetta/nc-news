const {
  fetchCommentsByArticleId,
  createComment,
  removeComment,
  checkCommentExists,
} = require("../models/comments.model");
const { checkArticleExists } = require("../models/articles.model");

exports.getComment = (req, res, next) => {
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

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  createComment(newComment, article_id)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  const promises = [removeComment(comment_id)];

  if (comment_id) {
    promises.push(checkCommentExists(comment_id));
  }

  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
