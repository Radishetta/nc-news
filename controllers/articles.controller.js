const {
  fetchArticleById,
  fetchArticles,
  updateArticle,
  checkTopicExists,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const {
    author,
    title,
    topic,
    created_at,
    votes,
    article_img_url,
    comment_count,
    sort_by,
    order,
  } = req.query;

  const promises = [
    fetchArticles(
      author,
      title,
      topic,
      created_at,
      votes,
      article_img_url,
      comment_count,
      sort_by,
      order
    ),
  ];

  if (topic) {
    promises.push(checkTopicExists(topic));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];

      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticle(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
