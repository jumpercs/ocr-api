const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); 
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes); 

app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads/'));

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}!`);
});

module.exports = app; 