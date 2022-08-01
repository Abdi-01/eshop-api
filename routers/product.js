const express = require('express');
const { uploader } = require('../config/uploader');
const { productController } = require('../controllers');
const route = express.Router();

// Konfigurasi uploader
const uploadFile = uploader('/imgProduct', 'IMGPRD').array('images', 1);

route.get('/', productController.getData)
route.post('/', uploadFile, productController.add);
route.delete('/:id', productController.deleteData);
route.patch('/:id', productController.update);

module.exports = route