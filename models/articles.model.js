const db = require("../db/connection");
exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ID not found",
        });
      } else return article[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id,
      articles.topic, articles.created_at, articles.votes, 
      articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count 
      FROM comments
      JOIN articles ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows: articles }) => {
      if (!articles.length) return Promise.reject({ status: 404, msg: "Articles not found" });
      else return articles;
    });
};
