const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const util = require('util');
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.query = util.promisify(db.query);

module.exports = async (req, res, next) => {

  const {authorization} = req.headers;
  const [tokenType, token] = authorization.split(' ')

  if (tokenType !== "Bearer"){
    res.status(401).send({
      errorMessage: "로그인이 필요합니다."
    });
    return;
  }

  console.log('미들웨어 사용함');
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      let users;
      const post = `SELECT * FROM user WHERE email = ?`;
      const results = await db.query(post,[decoded.email]);
      users = {
        userId: results[0]['userId'],
        email: results[0]['email'],
        nickname: results[0]['nickname'],
      };
      res.locals.user = users;
      console.log('로컬 유저는?', res.locals.user);
    } else {
      res.locals.user = undefined;
      console.log('토큰 없습니다.')
      console.log('로컬 유저는?', res.locals.user);
    }
  } catch (err) {
    res.status(401).send({ errorMessage: '로그인이 필요합니다' });
    return;
  }
  next();
};
