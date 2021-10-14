const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
require('date-utils')
const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// 댓글 조회
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const docomment = [postId]
    const post = 'SELECT * FROM comment WHERE upperPost = ?';
    await db.query(post, docomment,(error, results) => {
      res.status(200).send({ results });
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

// 댓글 작성
router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { nickname, comment } = req.body;
  let newDate = new Date();
  let date = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
 
  var docomment  = {
    commentTime : date,
    nickname : nickname,
    comment : comment,
    upperPost : postId
    }
  try {
    const post = 'INSERT INTO comment set ?;';
    await db.query(post, docomment, (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        res.status(200).send({ results });
      }
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

// 댓글 수정( 미들웨어때문에 배포하고 확인하기 )
router.patch('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const user = res.locals.user;
  var docomment = [comment, commentId , user.nickname]
  try {
    const post = 'UPDATE comment SET comment= ? WHERE commentId = ? AND nickname = ?;';
    await db.query(post, docomment, (error, results, fields) => {
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

// 댓글 삭제( 미들웨어때문에 배포하고 확인하기 )
router.delete('/:commentId',  authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const user = res.locals.user;
  try {
    var docomment = [commentId, user.nickname]
    const post = 'DELETE FROM comment WHERE commentId = ? AND nickname = ?;';
    db.query(post, docomment , (error, results, fields) => {
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
