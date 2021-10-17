const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const mysql = require('mysql');
const util = require('util');
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.query = util.promisify(db.query);

//게시글 조회
router.get('/', async (req, res) => {
  try {
    const { place } = req.query;
    if (!place) {             // 쿼리스트링으로 place값이 안들어있다면
      let post = `SELECT * FROM post ORDER BY postId DESC`;         // 모든 게시글을 postId를 역순으로 뽑아라
      await db.query(post, (error, results) => {
        res.send({ results });
      });
    } else {                  // place가 들어있다면?
      let post = `SELECT * FROM post WHERE place = ${place} ORDER BY postId DESC`;    // 게시글의 place가 넘어온 값과 같은 것들을 역순으로 뽑아라 !!
      await db.query(post, (error, results) => {
        res.send({ results });
      });
    }
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

//게시글 상세조회
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = `SELECT * FROM post WHERE postId = ${postId}`;       // postId가 넘어온 postId와 같은 게시글을 보여줘
    await db.query(post, (error, results) => {                        // db.query(쿼리문, 콜백)
      res.status(200).send({ results });
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

//게시물 작성            // url값 오염되지 않으려면 escape 꼭 사용하자 !
router.post('/', async (req, res) => {
  const { title, nickname, spec, image, desc, place } = req.body;
  const escapeQuery = {
    title: title,
    nickname: nickname,
    spec: spec,
    image: image,
    descr: desc,
    place: place,
  };

  try {
    const post = `INSERT INTO post set ?`;                      // post테이블에 ?를 저장해랏
    await db.query(post, escapeQuery, (error, results) => {     // db.query(쿼리문, escape했다면 넣을 값, 콜백)
      if (error) {
        res.status(400).send(error);
      } else {
        res.send({ results });
      }
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

//게시물 삭제
router.delete('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const user = res.locals.user;                                   // 미들웨어 거치니까 여기서 유저정보 꺼내기
  const nickname = user.nickname;
  try {
    const post = `DELETE FROM post WHERE postId = ${postId} and nickname = "${nickname}";`;     // post테이블에서, postId와 nickname이 넘어온 값과 같은 것을 삭제해라
    await db.query(post, req.body, (error, results, fields) => {
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

//게시물 수정
router.patch('/:postId', async (req, res) => {
  const { postId } = req.params;
  const title = req.body.title;
  const spec = req.body.spec;
  const image = req.body.image;
  const desc = req.body.desc;
  const place = req.body.place;
  const escapeEdit = { title: title, spec: spec, image: image, descr: desc, place: place };
  try {
    const post = `UPDATE post SET ? WHERE postId = ${postId};`;       // postId가 긁어온 postId와 같다면 수정하자
    await db.query(post, escapeEdit, (error, results, fields) => {
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