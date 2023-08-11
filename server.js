const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
// const { doc } = require('prettier');

dotenv.config({ path: './config.env' });

const port = process.env.PORT;
const DBPASSWORD = process.env.PASSWORD;
const DB = process.env.DATABASE.replace('<PASSWORD>', DBPASSWORD);
// const DBLocal = process.env.DATABASELOCAL;
// console.log(DBLocal);
mongoose
  .connect(DB)
  .then(con => {
    console.log(con.Connection);
    console.log('DB Connection Suucceesfully');
  })
  .catch(err => {
    console.log(err);
  });

console.log(`the port is ${port}`);
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
