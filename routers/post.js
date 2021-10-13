const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

//게시글 조회
router.get('/', (req, res) => {
  try {
    const { place } = req.query;
    if (!place) {
      let post = `SELECT * FROM post ORDER BY postId DESC`;
      db.query(post, (error, results) => {
        res.send({ results });
      });
    } else {
      let post = `SELECT * FROM post WHERE place = ${place} ORDER BY postId DESC`;
      db.query(post, (error, results) => {
        res.send({ results });
      });
    }
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

//게시글 상세조회
router.get('/:postId', (req, res) => {
  try {
    const { postId } = req.params;
    const post = `SELECT * FROM post WHERE postId = ${postId}`;
    db.query(post, (error, results) => {
      res.send({ results });
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

//게시물 작성
router.post('/', async (req, res) => {
  const { title, spec, image, desc, place } = req.body;
  try {
    const post = `INSERT INTO post (title, spec, image, descr, place) VALUES ("${title}", "${spec}", "${image}", "${desc}", "${place}")`;
    await db.query(post, req.body, (error, results, fields) => {
      if (error) {
        res.send(error);
      } else {
        res.send({ results });
      }
    });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

// //게시물 삭제
// router.delete('/:postId', async (req, res) => {
//   const { postId } = req.params;
//   const { nickname } = req.body;
//   const ispost = await posts.findById(postId);
//   if (ispost) {
//     //nickname == ispost["nickname"]
//     if (true) {
//       await posts.deleteOne({ postId });
//       res.status(200).send({ result: 'success' });
//     } else {
//       res.status(400).send({ result: '사용자 본인이 아님' });
//     }
//   } else {
//     res.status(400).send({ result: '게시글 존재하지 않음' });
//   }
// });
//
// //게시물 수정
// router.patch('/:postId', async (req, res) => {
//   const { postId } = req.params;
//   const { title, spec, image, desc, place } = req.body;
//   console.log(postId, title, spec, image, desc, place);
//   const ispost = await posts.findById(postId);
//   console.log(ispost);
//   if (ispost) {
//     //nickname == ispost["nickname"]
//     if (true) {
//       await posts.updateOne({ postId }, { $set: { title: title, spec: spec, image: image, desc: desc, place: place } });
//       res.status(200).send({ result: 'success' });
//     } else {
//       res.status(400).send({ result: 'err' });
//     }
//   } else {
//     res.status(400).send({ result: '게시글 존재하지 않음' });
//   }
// });

module.exports = router;