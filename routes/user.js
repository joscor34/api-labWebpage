'use strict'

const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const customMdw = require('../middleware/custom_middelware')

router.post('/login', userController.login)
router.post('/register', userController.register)

router.get('/subir-archivo', customMdw.ensureAuthenticated ,userController.uploadFile)

module.exports = router