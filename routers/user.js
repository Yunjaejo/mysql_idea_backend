const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const uf = require('./userfunction.js');

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

module.exports = router;