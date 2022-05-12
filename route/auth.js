const express = require('express');
const route = express.Router();
const user = require('../api/user.js');
const auth = require('../middleware/jwt.js');

route.post('/post-personal-details', auth, user.personalDetails);
route.get('/home', auth, user.homePage);
route.get('/get-notes', auth, user.getAllNotes);
route.post('/add-notes', auth, user.addNotes);
route.post('/delete-notes', auth, user.deleteNote);
route.put('/detail', auth, user.updateDetail);

module.exports = route;
