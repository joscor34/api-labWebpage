const { Router } = require("express");
'use strict'

const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.get('/subir-archivo', userController.uploadFile)

module.exports = router