const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
const port = process.env.PORT;

// 미들웨어 사용
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// db연결
const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
db.connect();

// 라우터 연결
const postRouter = require('./routers/post');
const userRouter = require('./routers/user');
const wishRouter = require('./routers/wish');
const commRouter = require('./routers/comment');
app.use('/post', [ postRouter ]);
app.use('/', [ userRouter ]);
app.use('/comment', [ commRouter ]);
app.use('/wish', [ wishRouter ]);

// 스웨거 사용
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`listening at http://localhost:${ port }`);
});
