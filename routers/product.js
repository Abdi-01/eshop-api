const express = require('express');
const { productController } = require('../controllers');
const route = express.Router();

route.get('/', productController.getData)
route.post('/', productController.add)
route.delete('/:id', productController.deleteData)
route.patch('/:id', productController.update)

module.exports = route