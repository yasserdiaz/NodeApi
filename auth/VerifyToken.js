var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {

  // Validar que en el header exista el token
  var token = req.headers['x-access-token'];
  if (!token) 
    return res.status(403).send({ auth: false, message: 'No existe el token.' });

  // Validar el token
  jwt.verify(token, config.secret, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, message: 'Token no autorizado.' });    

    req.userId = decoded.id;
    next();
  });

}

module.exports = verifyToken;