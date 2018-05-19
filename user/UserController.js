var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('./User');

// Crear nuevo usuario
router.post('/', VerifyToken, function (req, res) {
    User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("Error al crear el usuario");
            res.status(200).send(user);
        });
});

// Devolver todos los usuarios
router.get('/', VerifyToken, function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("Error en la busqueda.");
        res.status(200).send(users);
    });
});

// Devolver un usuario especifico
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("Error al buscar el usuario.");
        if (!user) return res.status(404).send("Usuario no encontrado.");
        res.status(200).send(user);
    });
});

// Borrar el usuario
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("Error al borrar el usuario.");
        res.status(200).send("Usuario: "+ user.name +" borrado.");
    });
});

// Actualizar usuario
router.put('/:id', VerifyToken, function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("Error al actualizar el usuario.");
        res.status(200).send(user);
    });
});


module.exports = router;