const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
require('date-utils');
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
    const docomment = [ postId ];
    const post = 'SELECT * FROM comment WHERE upperPost = ?';         // 댓글 불러오기, 어떤 게시글인지 escape 처리
    await db.query(post, docomment, (error, results) => {             // 쿼리문, ?에 넣을 값, 콜백
      res.status(200).send({ results });
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

// 댓글 작성
router.post('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { nickname, comment } = req.body;
  let newDate = new Date();
  let date = newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
  let docomment = {
    commentTime: date,
    nickname: nickname,
    comment: comment,
    upperPost: postId
  };
  try {
    const post = 'INSERT INTO comment set ?;';                      // 댓글을 저장한다. 저장되는 값 escape
    await db.query(post, docomment, (error, results, fields) => {   // db.query(쿼리문, 넣을 값, 콜백)
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

// 댓글 수정
router.patch('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const user = res.locals.user;                                   // 미들웨어를 통과하니까 유저정보 여기서 꺼내기
  let docomment = [ comment, commentId, user.nickname ];
  try {
    const post = 'UPDATE comment SET comment= ? WHERE commentId = ? AND nickname = ?;';   // 댓글테이블에서 값을 바꿔라. 모든 값을 escape !
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
router.delete('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const user = res.locals.user;
  try {
    let docomment = [ commentId, user.nickname ];
    const post = 'DELETE FROM comment WHERE commentId = ? AND nickname = ?;';     // 댓글id와 작성한 닉네임이 넘어온 값들과 같을 때 삭제해라 !
    db.query(post, docomment, (error, results, fields) => {
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
