const express = require('express')
const quizzController = require('../controllers/quizzController')
const router = express.Router()

router.post('/', function(req, res){quizzController.createQuizz(req, res)})

module.exports = router