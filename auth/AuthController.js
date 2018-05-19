var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

/**
 * Configurar JWT
 */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.post('/login', function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error en el servidor.');
    if (!user) return res.status(404).send('Usuario no encontrado.');
    
    // Validar contraseña
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // Si el usuario existe y la contraseña es valida
    // Crear token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // token expira en 24 horas
    });

    // Devolver token
    res.status(200).send({ auth: true, token: token });
  });

});

router.post('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  }, 
  function (err, user) {
    if (err) return res.status(500).send("Error en el registro de usuario.");

    // Registro de usuario sin errores
    // Crear token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // token expira en 24 horas
    });

    res.status(200).send({ auth: true, token: token });
  });

});

router.get('/me', VerifyToken, function(req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("Error en la busqueda del usuario.");
    if (!user) return res.status(404).send("Usuario no encontrado.");
    res.status(200).send(user);
  });

});

module.exports = router;