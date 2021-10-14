const express = require('express'); // 익스프레스 참조
const cookieParser = require('cookie-parser');
const app = express(); // 익스프레스 쓸때는 app이라고 명시
app.use(cookieParser()); // 쿠키값을 꺼낼 수 있음
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
// const authMiddleware = require('./middlewares/auth-middleware');
const cors = require('cors');
const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.connect();

db.query(`SHOW TABLES`, (error, results) => {
  if (error) {
    console.log(error);
  }
  console.log(results);
});

// const options = {
//   origin: 'http://example.com', // 접근 권한을 부여하는 도메인
//   credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
//   optionsSuccessStatus: 200 // 응답 상태 200으로 설정
// };
// app.use(cors(options));

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // POST로 메소드 받을 때 req.body로 사용가능하게 함
//
const postRouter = require('./routers/post');
const userRouter = require('./routers/user');
// const wishRouter = require('./routers/wish');
const commRouter = require('./routers/comment');
app.use('/post', [ postRouter ]); // postRouter를 api 하위부분에서 쓰겠다 !
app.use('/', [ userRouter ]);
app.use('/comment', [ commRouter ]);
// app.use('/wish', [ wishRouter ]);

app.listen(port, () => {
  console.log(`listening at http://localhost:${ port }`);
});
