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
    if (!place) {
      let post = `SELECT * FROM post ORDER BY postId DESC`;
      await db.query(post, (error, results) => {
        res.send({ results });
      });
    } else {
      let post = `SELECT * FROM post WHERE place = ${place} ORDER BY postId DESC`;
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
    const post = `SELECT * FROM post WHERE postId = ${postId}`;
    await db.query(post, (error, results) => {
      res.status(200).send({ results });
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

//게시물 작성
router.post('/', async (req, res) => {
  console.log('누군가가 글쓰기를 시도했어요. ')
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
    const post = `INSERT INTO post set ?`;
    await db.query(post, escapeQuery, (error, results) => {
      if (error) {
        console.log(( '포스트 쓰기에서 에러가 났어요. ', error ));
        res.status(400).send(error);
      } else {
        console.log(('포스트 쓰기가 성공했어요. '))
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
  const user = res.locals.user;
  const nickname = user.nickname;
  console.log(nickname, '님이 글을 삭제하려고합니다.')
  try {
    const post = `DELETE FROM post WHERE postId = ${postId} and nickname = "${nickname}";`;
    await db.query(post, req.body, (error, results, fields) => {
      if (error) {
        console.log('포스트 삭제요청왔는데 실패함', error);
        res.status(400).send(error);
      } else {
        console.log('포스트삭제요청 성공함.', postId);
        res.status(200).send({ results });
      }
    });
  } catch (err) {
    console.log('포스트 삭제요청 자체가 에러남 ', err);
    res.status(400).send({ err: err });
  }
});

//게시물 수정
router.patch('/:postId', async (req, res) => {
  console.log('포스트 수정라우터가 불린다불린다불린다');
  const { postId } = req.params;
  const title = req.body.title;
  const spec = req.body.spec;
  const image = req.body.image;
  const desc = req.body.desc;
  const place = req.body.place;
  const escapeEdit = { title: title, spec: spec, image: image, descr: desc, place: place };
  try {
    const post = `UPDATE post SET ? WHERE postId = ${postId};`;
    await db.query(post, escapeEdit, (error, results, fields) => {
      if (error) {
        console.log('포스트 수정요청 왔는데 에러남', error);
        res.status(400).send(error);
      } else {
        console.log('포스트 수정 성공');
        res.status(200).send({ results });
      }
    });
  } catch (err) {
    console.log('포스트 수정요청 자체가 에러남', err);
    res.status(400).send({ err: err });
  }
});

module.exports = router;