var jwt = require('jsonwebtoken');
require('dotenv').config();

//---------------------middleware function that authenticates a user using jwt

async function auth(req, res, next) {
  var token = req.headers['auth'];
  if (token) {
    try {
      const auth = await jwt.verify(token, process.env.SECRET);
      userId = auth.id;
      return next();
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  } else {
    return res.status(400).send({
      success: false,
      message: 'token has expired please log in again',
    });
  }
}
module.exports = auth;
