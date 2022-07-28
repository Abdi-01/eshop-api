const express = require('express');
const { productController } = require('../controllers');
const route = express.Router();

route.get('/', productController.getData)

module.exports = route