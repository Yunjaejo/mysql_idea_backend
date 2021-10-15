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
    const escapeQuery = [user.userId]
    const post = 'SELECT post.*, wish.Id FROM post inner join wish On post.postId = wish.postId WHERE wish.userId = ?';
    let results = await db.query(post,escapeQuery);
    for(indexresults of results)
    if (indexresults.hasOwnProperty('Id')) {
      indexresults.wishId= indexresults.Id;
      delete indexresults.Id;
    }
    res.status(200).send({ post: results });
  } catch (err) {
    console.log("wish get요청시 에러가?");
    res.status(400).send({ err: err });
  }
});
///
router.post("/", authMiddleware, async (req, res) => {
  const { postId } = req.body; // 사실 이거 포스트아이디임
  console.log('포스트아이디는?' ,postId)
  console.log('바디는?' ,req.body)
  const user = res.locals.user;
  try {
    const escapeQuery = [ user.userId , postId ]
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
    console.log("여기서 에러가??")
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