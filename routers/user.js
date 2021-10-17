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

// 로그인
router.post('/login', async (req, res) => {
  const { email, pw } = req.body;
  let users;
  const post = 'SELECT * FROM user WHERE email = ?';      // escape 처리: 이메일이 [email]인 모든유저정보를 찾음 => 배열로 나옴
  const results = await db.query(post, [ email ]);          // db.query(쿼리문, ?에 넣을값)
  users = results[0];                                     // 배열을 객체로 꺼냄
  if (users) {                                            // 유저가 존재한다면? (이미 가입했다면)
    if (users.password === pw) {                          // db의 비밀번호와 받아온 비밀번호가 맞는지 검증하고)
      const token = jwt.sign({
        email: users.email,
        nickname: users.nickname
      }, process.env.SECRET_KEY, { expiresIn: '24h' }); // 토큰에 email, nickname을 담아준다.
      res.cookie('user', token);
      res.json({ token });
    } else {
      res.status(400).send({});
    }
  } else {                                                // 유저가 없다면? (가입하지 않았다면)
    res.status(400).send({});
  }
});

//회원가입
router.post('/signup', async (req, res) => {
  const { email, pw, pwCheck, nickname } = req.body;
  if (!await uf.emailExist(email)) {                                // 받아온 email을 usefunction.js의 emailExist함수에 넣어봄 => 있으면 false를, 없으면 true를 반환
    res.status(401).send({ result: '선생님, 이메일이 중복같은데요??' });   // 회원가입 조건에 맞지 않다면
  } else if (!await uf.nicknameExist(nickname)) {                   // 닉네임 중복 검사
    res.status(401).send({ result: '선생님, 닉네임이 중복같은데요??' });
  } else if (!uf.idCheck(email)) {                                  // id 정규식 검사
    res.sendStatus(401);
  } else if (!uf.pwConfirm(pw, pwCheck)) {                          // 비밀번호와 비밀번호 확인이 맞는지 검사
    res.sendStatus(401);
  } else if (!uf.pwLenCheck(pw)) {                                  // 비밀번호 최소길이 검사
    res.sendStatus(401);
  } else if (!uf.pw_idCheck(email, pw)) {                           // 아이디가 비밀번호를 포함하는지 검사

  } else {
    const dopost = [ email, pw, nickname ];
    const post = 'INSERT INTO user (email, password, nickname) VALUES (?, ? ,?);';    // db에 저장, 저장되는 값을 escape 처리
    db.query(post, dopost, (error, results, fields) => {        // db.query(쿼리문, 넣을 값, 콜백)
      if (error) {
        res.status(401).send(error);
      } else {
        console.log('누군가가 회원가입을 했습니다.');
        res.send({ results: '완료?' });
      }
    });
  }
});

module.exports = router;