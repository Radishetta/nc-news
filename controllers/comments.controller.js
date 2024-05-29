const { fetchCommentsByArticleId } = require("../models/comments.model");
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
