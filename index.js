'use strict'
require('dotenv').config()
const express = require('express')
const colors = require('colors')
const user_routes = require('./routes/user')
const customMdw = require('./middleware/custom_middelware')

var cors = require('cors')
var app = express()

app.use(cors())

// Configuraciones de headers para evitar problemas con CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token')

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')

  res.header('Access-Control-Expose-Headers', 'x-auth-token')

  next()
})

// Configuramos el puerto donde correra la app
const port = process.env.PORT || 8000

// Conectamos todos lops routers
app.use('/api/user', user_routes)

app.get('/', (req, res) => {
	res.send('HOLA MUNDO!!')
})

app.use(customMdw.errorHandler)
app.use(customMdw.notFoundHandler)

app.listen(port, () => {
	console.log(colors.cyan(`La aplicacion esta corriendo en http://localhost:${port}`))
})