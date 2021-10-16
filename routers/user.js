const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const uf = require('./userfunction.js');
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
// const mysql = require('sync-mysql');
// const db = new mysql({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });

// 로그인 쿼리문
router.post('/login', async (req, res) => {
  const { email, pw } = req.body;
  let users;
  const post = 'SELECT * FROM user WHERE email = ?';
  const results = await db.query(post, [email]);
  users = results[0];
  if (users) {
    if (users.password === pw) {
      const token = jwt.sign({ email: users.email, nickname: users.nickname }, process.env.SECRET_KEY, {expiresIn: '24h'});
      res.cookie('user', token);
      res.json({ token });
    } else {
      res.status(400).send({});
    }
  } else {
    res.status(400).send({});
  }
});

//회원가입 쿼리문
router.post('/signup', async (req, res) => {
  const { email, pw, pwCheck, nickname } = req.body;
  console.log(await uf.emailExist(email));
  if (!await uf.emailExist(email)) {
    res.status(401).send({ result: '선생님, 이메일이 중복같은데요??' });
  } else if (!await uf.nicknameExist(nickname)) {
    res.status(401).send({ result: '선생님, 닉네임이 중복같은데요??' });
  } else if (!uf.idCheck(email)) {
    res.status(401).send({});
  } else if (!uf.pwConfirm(pw, pwCheck)) {
    res.status(401).send({});
  } else if (!uf.pwLenCheck(pw)) {
    res.status(401).send({});
  } else if (!uf.pw_idCheck(email, pw)) {
    res.status(401).send({});
  } else {
    const dopost = [email, pw, nickname]
    const post = 'INSERT INTO user (email, password, nickname) VALUES (?, ? ,?);';
    db.query(post, dopost, (error, results, fields) => {
      if (error) {
        res.status(401).send(error);
      } else {
        res.send({ results: '완료?' });
      }
    });
  }
});

module.exports = router;