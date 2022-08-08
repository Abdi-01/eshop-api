const express = require('express');
const { readToken } = require('../config/encript');
const { authController } = require('../controllers');
const route = express.Router();
const passport = require('passport');

route.get('/all', authController.getData);
route.post('/login', authController.login);
route.post('/regis', authController.register);
route.get('/keep', readToken, authController.keepLogin);
route.patch('/verified', readToken, authController.verification);

// routing for google API
route.get('/google', passport.authenticate('google',{scope:['profile','email']}));
route.get('/google/callback',passport.authenticate('google',{
    successRedirect:process.env.FE_URL,
    failureRedirect:process.env.FE_URL+`?message=401_auth_failure`
}));

module.exports = route;