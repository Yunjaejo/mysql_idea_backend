const util = require('util');
const mysql = require('mysql');
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.query = util.promisify(db.query)

function idCheck(id_give) {
    const reg_name = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (reg_name.test(id_give) && id_give.length >= 3) {
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
  async function emailExist (id_give) {
    const post = `SELECT * FROM user WHERE email = "${id_give}";`;
    const results = await db.query(post);
    if(results.length){
      console.log(results)
      return false;
    }else{
      return true;
    }
  }
  async function nicknameExist (id_give) {
    const post = `SELECT * FROM user WHERE nickname = "${id_give}";`;
    const results = await db.query(post);
    if(results.length){
      console.log(results)
      return false;
    }else{
      return true;
    }
  }

  
  module.exports = { idCheck, pwConfirm, pwLenCheck, pw_idCheck, emailExist, nicknameExist };