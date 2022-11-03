const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const error_types = require('./error_types')
const User = require('../models/UserData/user_model')
const colors = require('colors')
const fs = require('fs');
const path = require('path')
const Proyecto = require('../models/UserData/file_model')
const nodemailer = require('nodemailer')
require('dotenv').config()

let controller = {
	uploadFile: (req, res, next) => {
		console.log(colors.cyan('Creando proyecto'))
		var proyecto = new Proyecto({
			_userId: req.body.userId,
			paper: req.body.paper,
			authors: req.body.authors,
			title: req.body.title,
			submitted_time: Date.now(),
			last_update_time: Date.now(),
			coordinador: req.body.coordinador,
			keywords: req.body.keywords,
			abstract: req.body.abstract,
			pdf:{
				data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
				contentType: 'application/pdf'
			}
		})
		return proyecto.save((err) => {
			if(err){
				return next(new error_types.InfoError(err))
      } else {
				res.json(proyecto)
      }
		})
	},
	register: (req, res, next) => {
    console.log(colors.bgMagenta('Caso register user'))
    User.findOne({ email: req.body.email })
      .then(data => {
        if(data) {
          throw new error_types.InfoError('el email ya esta registrado')
        } else {
          console.log(colors.bgGreen('Creando usuario'))
          var hash = bcrypt.hashSync(req.body.password, parseInt(process.env.BCRYPT_ROUNDS))
          let document = new User({
						email: req.body.email,
						first_name: req.body.firstName,
						last_name: req.body.lastName,
						phone_number: req.body.phoneNumber,
            password: hash
          })
          return document.save((err) => {
            if(err) {
              return res.status(500).send({ msg: err.message })
            } else {
              res.json(document)
              nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'labweb.nonreply@gmail.com',
                  pass: process.env.APPPASS
                },
                port: 465,
                host: 'smtp.gmail.com'
              }).sendMail({
                from: 'email',
                to: document.email,
                subject: "Creación de cuenta",
                text: "Felicidades se ha creado una nueva cuenta con este correo electrónico"
              }, (err) => {
                if(err) {
                  console.log(err)
                } else {
                  console.log('Se envió el correo correctamente :D')
                }
              })
            }
          })
        } 
      })
      .catch(err => {
        next(err)
      })
  },
	login: (req, res, next) => {
    console.log(colors.bgMagenta('Caso login'))
    passport.authenticate('user-local', { session: false }, (error, user) => {
      console.log('Ejecutando *callback auth* de authenticate para estrategia local')
      if (error || !user) {
        next(new error_types.Error404('username or password not correct.'))
      } 
      else {
        console.log(colors.cyan('*** comienza generacion token***'))
        const payload = {
					sub: user._id,
					name: user.first_name,
					userType: 0,
          exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
          email: user.email
        }

        /*solo indicamos el payload ya que el header ya lo crea la lib jsonwebtoken internamente
        para el calculo de la firma y así obtener el token*/
        const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, {algorithm: process.env.JWT_ALGORITHM})
        res.json({ data: { token: token } })
      }
    })(req, res)
  },

}
module.exports = controller