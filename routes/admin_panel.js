const express = require('express')
const router = express.Router()
const customMdw = require('../middleware/custom_middelware')
//const SampleController = require('../controllers/sample')
const AdminController = require('../controllers/admin')

router.post('/login', AdminController.login)
router.post('/register', AdminController.register)


router.get('/prueba', (req, res, next) => {
	res.send('Pasó la prueba')
})

module.exports = router