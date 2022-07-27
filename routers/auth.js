const express = require('express');
const { authController } = require('../controllers');
const route = express.Router();

route.get('/all', authController.getData);
route.post('/login', authController.login);
route.post('/regis', authController.register);
route.get('/keep', authController.keepLogin);

module.exports = route;