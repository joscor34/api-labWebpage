'use strict'

const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const uploadPdfMdw = require('../middleware/file_middleware')
const customMdw = require('../middleware/custom_middelware')

router.post('/login', userController.login)
router.post('/register', userController.register)

router.post('/subir-archivo', uploadPdfMdw.single('proyecto') ,customMdw.ensureAuthenticated ,userController.uploadFile)

module.exports = router