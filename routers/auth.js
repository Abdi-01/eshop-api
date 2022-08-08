const express = require('express');
const { readToken } = require('../config/encript');
const { authController } = require('../controllers');
const route = express.Router();

route.get('/all', authController.getData);
route.post('/login', authController.login);
route.post('/regis', authController.register);
route.get('/keep', readToken, authController.keepLogin);
route.patch('/verified', readToken, authController.verification);

// routing for google API

module.exports = route;