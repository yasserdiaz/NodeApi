var express = require('express');
var app = express();
var db = require('./db');
global.__root   = __dirname + '/'; 

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var options = {
  explorer : true
};
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.get('/api', function (req, res) {
  res.status(200).send('API Funciona!');
});

var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;