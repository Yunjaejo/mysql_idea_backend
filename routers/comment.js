const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
require("date-utils");

// postId 검증은 내일하자...!

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = `SELECT * FROM comment WHERE upperPost = ${postId}`;
    db.query(post, (error, results) => {
      res.status(200).send({ results });
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

router.post("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { nickname, comment } = req.body;
  let newDate = new Date();
  let date = newDate.toFormat("YYYY-MM-DD HH24:MI:SS");
  try {
    const post = `INSERT INTO comment (commentTime, nickname, comment, upperPost ) VALUES ("${date}","${nickname}", "${comment}", "${postId}");`;
    db.query(post, req.body, (error, results, fields) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send({ results });
      }
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

router.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { email, comment } = req.body;
  
  try {
    const post = `UPDATE comment SET comment= "${comment}" WHERE commentId = ${commentId};`;
    db.query(post, req.body, (error, results, fields) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send({ results });
      }
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

router.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  try {
    const post = `DELETE FROM comment WHERE commentId = ${commentId};`;
    db.query(post, req.body, (error, results, fields) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send({ results });
      }
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

module.exports = router;
