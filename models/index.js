const mongoose = require('mongoose');

const connect = () => {
  mongoose
    .connect(
      'mongodb://test:test@13.124.99.118:27017/IDEA?authSource=admin',
      // 'mongodb://localhost:27017/IDEA',
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
  // .catch((err) => console.error(err));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
