'use strict'
require('dotenv').config()
const express = require('express')
const colors = require('colors')
const user_routes = require('./routes/user')
const admin_routes = require('./routes/admin_panel')
const customMdw = require('./middleware/custom_middelware')
const mongoose = require('mongoose')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('./models/UserData/user_model')
const Admin = require('./models/AdminData/admin_model')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

var cors = require('cors')
var app = express()

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.catch((err) => {console.log(err); process.exit(1)})

mongoose.connection.on('connected', () => {
  console.log(colors.bold('Mongoose connected!'))
})

app.use(cors())


//Configuramos las estrategias locales para poder cifrar a un usuario y un administrador
passport.use('admin-local', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	session: false
}, (username, password, done) => {
	console.log(colors.green('Ejecutando *Callback verfiy de estrategia local-admin*'))
	Admin.findOne({email:username})
	.then(data => {
		if(data === null) return done(null, false) // El usuario no existe
    else if(!bcrypt.compareSync(password, data.password)) { return done(null, false) }
		return done(null,data) // Ok
	}).catch(err => done(err, null))
}))

passport.use('user-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, (username, password, done) => {
  console.log(colors.yellow('Ejecutando *callback verify* de estrategia local-user'))
  User.findOne({email:username})
  .then(data => {
    if(data === null) return done(null, false) // El usuario no existe
    else if(!bcrypt.compareSync(password, data.password)) { return done(null, false) }
    return done(null,data) // Ok
  })
  .catch(err => done(err, null)) // Error en la DB
}))

//Configuramos las estrategias de JWT para obtener informacion y saber si esta autenticado
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET
opts.algorithms = [process.env.JWT_ALGORITHM]

passport.use('admin-jwt', new JwtStrategy(opts, (jwt_payload, done) => {
  console.log(colors.yellow('Ejecutando *callback verify* de estrategia jwt'))
  Admin.findOne({_id: jwt_payload.sub})
  .then(data => {
    if(data === null){
      return done(null, false)
    } else {
      return done(null, data)
    }
  }).catch(err => done(err, null))
}))

passport.use('user-jwt', new JwtStrategy(opts, (jwt_payload, done) => {
  console.log(colors.yellow('Ejecutando *callback verify* de estrategia jwt'))
  User.findOne({_id: jwt_payload.sub})
  .then(data => {
    if(data === null){
      return done(null, false)
    } else {
      return done(null, data)
    }
  }).catch(err => done(err, null))
}))

// Configuraciones de headers para evitar problemas con CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token')

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')

  res.header('Access-Control-Expose-Headers', 'x-auth-token')

  next()
})

// conectamos todos los middleware de terceros
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(passport.initialize())

// Configuramos el puerto donde correra la app
const port = process.env.PORT || 8000

// Conectamos todos lops routers
app.use('/api/user', user_routes)
app.use('/api/admin', admin_routes)

app.get('/', (req, res) => {
	res.send('HOLA MUNDO!!')
})

//por último nuestro middleware para manejar errores
app.use(customMdw.errorHandler)
app.use(customMdw.notFoundHandler)

app.listen(port, () => {
	console.log(colors.cyan(`La aplicacion esta corriendo en http://localhost:${port}`))
})