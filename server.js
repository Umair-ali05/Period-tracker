//-----------------------Requirements and dependencies

const express = require('express');
const bodyParser = require('body-parser');
const mongoDb = require('mongoose');
const unAuthRoute = require('./route/unAuth.js');
const authRoute = require('./route/auth.js');
require('dotenv').config();
const app = express();
const { PORT, MONGO_URL } = process.env;

app.use(bodyParser.json());
app.use('/unAuth', unAuthRoute);
app.use('/auth', authRoute);

mongoDb.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoDb.connection;

db.on('err', console.error.bind('there is a connection err'));
app.listen(PORT, () => {
  console.log({ success: true, message: `app is running at port ${PORT}` });
});
