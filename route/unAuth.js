const express = require('express');
const route = express.Router();
const user = require('../api/user.js');

route.post('/register', user.register);
route.post('/login', user.login);
module.exports = route;
