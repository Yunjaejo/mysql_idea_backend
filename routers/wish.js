const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const mysql = require('mysql');
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.query = util.promisify(db.query);

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const post = `SELECT * FROM wish WHERE userId = "${user.userId}"`;
    const results = await db.query(post);

    let b = [];
    for (a of results) {
      b.push(a['postId']);
    }
    //Post.find ( { _id: { $in: b } } )
    let d = [];

    for (c of b) {
      const posttest = `SELECT * FROM post WHERE postId = "${c}"`;
      const results123 = await db.query(posttest);
      d.push(results123);
    }
    console.log(d);

    res.status(200).send({ post: d });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { email, postId } = req.body;
  try {
    const post = INSERT INTO post (email, postId) VALUES ( "${email}", "${postId}");
    db.query(post, req.body, (error, results) => {
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

router.delete("/:wishId", async (req, res) => {
  const { wishId } = req.params;
  const { isWish } = req.body;
  try {
    const post = DELETE FROM post WHERE postId = ${wishId} and nickname = "${isWish}";;
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