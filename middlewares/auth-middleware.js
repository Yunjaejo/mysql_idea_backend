const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const token = req.cookies.user;
  console.log('미들웨어 사용함');
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ userId: decoded.userId }).exec();
      const users ={
        userId : user._id,
        email: user.email,
        nickname: user.nickname,
      }
      
      res.locals.user = users;
      console.log('로컬 유저는?', res.locals.user);
    } else {
      res.locals.user = undefined;
      console.log('로컬 유저는?', res.locals.user);
    }
  } catch (err) {
    res.status(401).send({ errorMessage: '로그인이 필요합니다' });
    return;
  }
  next();
};
