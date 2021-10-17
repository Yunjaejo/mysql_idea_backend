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

function idCheck(id_give) {
  const reg_name = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;  // 이메일 정규식표현
  if (reg_name.test(id_give) && id_give.length >= 3) {    // 아이디가 정규식에 부합하면서 3글자가 넘는다면?
    return true;
  }
  return false;
}

function pwConfirm(pw_give, pw2_give) {
  if (pw_give === pw2_give) {
    return true;
  }
  return false;
}

function pwLenCheck(pw_give) {
  if (pw_give.length >= 4) {
    return true;
  }
  return false;
}

function pw_idCheck(id_give, pw_give) {
  if (!id_give.includes(pw_give)) {
    return true;
  }
  return false;
}

async function emailExist(email_give) {
  const post = 'SELECT * FROM user WHERE email = ?;';     // email을 받아서 user정보가 이미 존재하는지 확인
  const results = await db.query(post,[email_give]);
  if (results.length) {       // 배열은 0이라도 트루니까 length로 확인하기
    return false;
  } else {
    return true;
  }
}

async function nicknameExist(nick_give) {
  const post = 'SELECT * FROM user WHERE nickname = ?;';    // 받아온 닉네임으로 이미 정보가 있는지 검사
  const results = await db.query(post,[nick_give]);
  if (results.length) {           // Boolean([])  true이다.
    return false;
  } else {
    return true;
  }
}


module.exports = { idCheck, pwConfirm, pwLenCheck, pw_idCheck, emailExist, nicknameExist };