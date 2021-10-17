const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const util = require('util');
const mysql = require('mysql');
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.query = util.promisify(db.query);

// 위시리스트 불러오기
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const escapeQuery = [user.userId]
    const post = 'SELECT post.*, wish.Id FROM post inner join wish On post.postId = wish.postId WHERE wish.userId = ?';   // inner조인, velog 정리해둠
    let results = await db.query(post,escapeQuery);
    for(indexResults of results)                    // 쿼리의 결과 배열을 하나씩 뽑음
    if (indexResults.hasOwnProperty('Id')) {        // indexResults가 Id라는 키가 있다면 true, 아니면 false
      indexResults.wishId= indexResults.Id;
      delete indexResults.Id;                       // wishId를 Id로 바꾸고 Id는 삭제
    }
    res.status(200).send({ post: results });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

// 위시리스트 추가하기
router.post("/", authMiddleware, async (req, res) => {
  const { postId } = req.body;
  const user = res.locals.user;
  try {
    const escapeQuery = [ user.userId , postId ]
    const post = 'INSERT INTO wish (userId, postId) VALUES ( ?, ? )';
    db.query(post, escapeQuery, (error, results) => {
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