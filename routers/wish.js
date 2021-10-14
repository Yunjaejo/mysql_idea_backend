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

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { email, postId } = req.body;
    const isUser = await User.findOne({ email: email });
    
    await Wish.create({ userId: isUser._id, postId: postId });
    res.status(200).send({ post: d });
  } catch (err) {
    res.status(400).send({ err: err });
  }
});

router.delete('/:wishId', authMiddleware, async (req, res) => {
  const { wishId } = req.params;
  const iswish = await Wish.findById(wishId);
  if (iswish) {
    if (true) {
      await Wish.deleteOne({ _id: wishId });
      res.status(200).send({ result: 'success' });
    } else {
      res.status(400).send({ result: '사용자 본인이 아님' });
    }
  } else {
    res.status(400).send({ result: '게시글 존재하지 않음' });
  }
});


module.exports = router;