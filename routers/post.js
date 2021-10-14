const express = require('express');
const router = express.Router();
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
  const { title, nickname, spec, image, desc, place } = req.body;
  const escapeQuery = {
    title: title,
    nickname: nickname,
    spec: spec,
    image: image,
    descr: desc,
    place: place,
  }

  try {
    console.log(image);
    const post = `INSERT INTO post set ?`;
    await db.query(post, escapeQuery, (error, results) => {
      if (error) {
        console.log((error));
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
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { nickname } = req.body;
  try {
    const post = `DELETE FROM post WHERE postId = ${postId} and nickname = "${nickname}";`;
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
  const { title, spec, image, desc, place } = req.body;
  try {
    const post = `UPDATE post SET title= "${title}",spec ="${spec}",descr ="${desc}",image ="${image}",place =${place} WHERE postId = ${postId};`;
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

module.exports = router;