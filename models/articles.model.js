const db = require("../db/connection");
exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article ID Not Found",
        });
      } else return article[0];
    });
};

exports.fetchArticles = (topic) => {
  let querySql = `SELECT articles.author, articles.title, articles.article_id,
  articles.topic, articles.created_at, articles.votes, 
  articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count 
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const queryValues = [];

  if (topic) {
    querySql += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  querySql += ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  querySql += ";";

  return db.query(querySql, queryValues).then(({ rows: articles }) => {
    return articles;
  });
};

exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows: updatedArticle }) => {
      if (updatedArticle[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Article ID Not Found" });
      }
      return updatedArticle[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows: articles }) => {
      if (!articles.length) {
        return Promise.reject({ status: 404, msg: "Articles Not Found" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  return db.query(`SELECT * from topics WHERE slug = $1;`, [topic]).then(({ rows: topic }) => {
    if (topic.length === 0) return Promise.reject({ status: 404, msg: "Topic Not Found" });
  });
};
