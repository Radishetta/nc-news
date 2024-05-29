const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments 
  WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.createComment = (newComment, article_id) => {
  const { username, body } = newComment;

  return db
    .query(
      `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [article_id, username, body]
    )
    .then(({ rows: newComment }) => {
      return newComment[0];
    });
};
