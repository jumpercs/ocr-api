const express = require('express');
const { uploadImagem } = require('./controllers');
const { configurarUpload } = require('./middlewares');

const router = express.Router();

router.post('/upload', configurarUpload, uploadImagem);

module.exports = router;