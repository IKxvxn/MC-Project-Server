const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

router.post('/account', function(req, res){authController.crearCuenta(req, res)})
router.get('/account/:username/:password', function(req, res){authController.ingresar(req, res)})

module.exports = router