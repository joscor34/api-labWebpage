const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const error_types = require('./error_types')
const Admin = require('../models/AdminData/admin_model')
const colors = require('colors')
const User = require('../models/UserData/user_model')
const Proyecto = require('../models/UserData/file_model')


let controller = {
  login: (req, res, next) => {
    console.log(colors.bgMagenta('Caso login admin'))
    passport.authenticate('admin-local', { session: false }, (error, user) => {
      console.log('Ejecutando *Callback auth* de autenticacion para estrategia local')
      if(error || !user) {
        next(new error_types.Error404('Username or password not correct'))
      }
      else {
        console.log(colors.cyan('*** comienza generacion token***'))
        const payload = {
					sub: user._id,
					name: user.first_name,
					userType: 1,
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
	register: (req, res, next) => {
    console.log(colors.bgMagenta('Caso register admin'))
    Admin.findOne({ email: req.body.email })
      .then(data => {
        if(data) {
          throw new error_types.InfoError('el email ya esta registrado')
        } else {
          console.log(colors.bgGreen('Creando usuario'))
          var hash = bcrypt.hashSync(req.body.password, parseInt(process.env.BCRYPT_ROUNDS))
          let document = new Admin({
						email: req.body.email,
						first_name: req.body.first_name,
						last_name: req.body.last_name,
            password: hash
          })
          return document.save((err) => {
            if(err) {
              return res.status(500).send({ msg: err.message })
            } else {
              res.json(document)
            }
          })
        } 
      })
      .catch(err => {
        next(err)
      })
	},
	getProyectById: (req, res, next) => {
		Proyecto.findById(req.body.proyectId).then(data => {
			if(!data){
				res.status(404)
				return next(new error_types.Error404('Proyectos no existen'))
			} else {
				res.send(data)
			}
		}).catch(err => {
			res.send(err).status(500)
		})
	},

	getAllProyectos: (req, res, next) => {
		Proyecto.find().then(data => {
			if(!data || data.length === 0){
				res.status(404)
				return next(new error_types.Error404('Proyectos no existen'))
			} else {
				res.status(200).send(data)
			}
		})
	},

	getUserById: (req, res, next) => {
		User.findById(req.body.userId).then(data => {
			if(!data || data.length === 0){
				res.status(404)
				return next(new error_types.Error404('El usuario no existe'))
			} else {
				res.status(200).send(data)
			}
		}).catch(err => {
			res.send(err).status(500)
		})
	},
	eliminateProyect: (req, res, next) => {
		Proyecto.findByIdAndRemove(req.body.proyectId).then(data => {
			res.send(data).status(200)
		}).catch(err => {
			res.send(err).status(500)
		})
	}
}

module.exports = controller