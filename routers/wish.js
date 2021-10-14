const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const Post = require('../models/post');
const User = require('../models/user');
const Wish = require('../models/wish');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const wish = await Wish.find({ userId: user.userId });
    let b = [];
    for (a of wish) {
      b.push(a['postId']);
    }
    //Post.find ( { _id: { $in: b } } )
    let d = [];
    for (c of b) {
      let post = await Post.findById(c);
      d.push(post);
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