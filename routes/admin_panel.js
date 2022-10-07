const express = require('express')
const router = express.Router()
const customMdw = require('../middleware/custom_middelware')
//const SampleController = require('../controllers/sample')
const AdminController = require('../controllers/admin')

router.post('/login', AdminController.login)
router.post('/register', AdminController.register)


router.get('/proyectos', customMdw.ensureAuthenticatedAdmin, AdminController.getAllProyectos)
router.post('/proyecto', customMdw.ensureAuthenticatedAdmin, AdminController.getProyectById)
router.post('/obtenerUsuario', customMdw.ensureAuthenticatedAdmin, AdminController.getUserById)
router.post('/delProyect', customMdw.ensureAuthenticatedAdmin, AdminController.eliminateProyect)

module.exports = router