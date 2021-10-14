const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const uf = require('./userfunction.js');
const util = require('util')
const mysql = require('mysql');
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.query = util.promisify(db.query)
// const mysql = require('sync-mysql');
// const db = new mysql({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });


// 회원가입
router.post('/signup', async (req, res) => {
  const { email, pw, pwCheck, nickname } = req.body;
  const existId = await User.findOne({ email: email });
  const existName = await User.findOne({ nickname: nickname });
  if (existId) {
    res.status(400).send({ result: '아이디가 중복입니다.' });
  } else if (existName) {
    res.status(401).send({ result: '닉네임이 중복입니다.' });
  } else if (!uf.idCheck(email)) {
    res.status(401).send({});
  } else if (!uf.pwConfirm(pw, pwCheck)) {
    res.status(401).send({});
  } else if (!uf.pwLenCheck(pw)) {
    res.status(401).send({});
  } else if (!uf.pw_idCheck(email, pw)) {
    res.status(401).send({});
  } else {
    await User.create({
      email: email,
      pw: pw,
      nickname: nickname
    });
    res.send({ result: 'success' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, pw } = req.body;
  const users = await User.findOne({ email: email });
  if (users) {
    if (users.pw === pw) {
      //{expiresIn: '5m'}
      const token = jwt.sign({ email: users.email, nickname: users.nickname }, '4W-idea-key');
      res.cookie('user', token);
      res.json({ token });
    } else {
      res.status(400).send({});
    }
  } else {
    res.status(400).send({});
  }
});




// 로그인 쿼리문
router.post('/loginwhat?', async (req, res) => {
  const { email, pw } = req.body;
  let users
  const post = `SELECT * FROM uesr WHERE email = ${email}`;
  const results = db.query(post)
  users = results[0];
  if (users) {
    if (users.password === pw) {
      //{expiresIn: '5m'}
      const token = jwt.sign({ email: users.email, nickname: users.nickname }, process.env.SECRET_KEY);
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
router.post('/signupwhat', async (req, res) => {
  const { email, pw, pwCheck, nickname } = req.body;
  console.log(await uf.emailExist(email));
  if (!await uf.emailExist(email)) {
    res.status(401).send({ result: '아니 이게 맞나?' });
  } else if (await uf.nicknameExist(nickname)) {
    res.status(401).send({ result: '닉네임이 중복입니다.' });
  } else if (!uf.idCheck(email)) {
    res.status(401).send({});
  } else if (!uf.pwConfirm(pw, pwCheck)) {
    res.status(401).send({});
  } else if (!uf.pwLenCheck(pw)) {
    res.status(401).send({});
  } else if (!uf.pw_idCheck(email, pw)) {
    res.status(401).send({});
  } else {
    const post = `INSERT INTO user (email, password, nickname) VALUES ("${email}", "${pw}", "${nickname}");`;
    db.query(post, req.body, (error, results, fields) => {
      if (error) {
        res.status(401).send(error);
      } else {
        res.send({ results : "완료?" });
      }
    });
  }
});

module.exports = router;