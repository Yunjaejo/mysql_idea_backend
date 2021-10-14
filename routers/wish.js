const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const util = require('util');
const mysql = require('mysql');
const { SSL_OP_SINGLE_DH_USE } = require('constants');
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.query = util.promisify(db.query);

//수정필요 GET WISH ID 줄필요 있음....! 
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const post = `SELECT * FROM wish WHERE userId = ${user.userId}`;
    const results = await db.query(post);
    let 포스트아이디리스트 = [];
    for (a of results) {
      doc = {
        wishId : a['Id'],
        postId : a['postId']
      }
      포스트아이디리스트.push(doc);
    }
    //Post.find ( { _id: { $in: b } } )
    let postList = [];
    for (let i = 0 ; i < 포스트아이디리스트.length; i++) {
      const posttest = `SELECT * FROM post WHERE postId = "${포스트아이디리스트[i].postId}"`;
      let resultspost = await db.query(posttest);
      resultspost[0].wishId = 포스트아이디리스트[i].wishId;
      postList.push(resultspost[0]);
    }
    res.status(200).send({ post: postList });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});
///
router.post("/", authMiddleware, async (req, res) => {
  const { email, postId } = req.body;
  const user = res.locals.user; 
  try {
    const escapeQuery = [ user.userId , postId]
    const post = 'INSERT INTO wish (userId, postId) VALUES ( ?, ? )';
    db.query(post, escapeQuery, (error, results) => {
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

router.delete("/:wishId", authMiddleware, async (req, res) => {
  const { wishId } = req.params;
  const user = res.locals.user; 
  try {
    const escapeQuery = [wishId, user.userId]
    const post = 'DELETE FROM wish WHERE Id = ? and userId = ?;';
    db.query(post, escapeQuery, (error, results, fields) => {
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