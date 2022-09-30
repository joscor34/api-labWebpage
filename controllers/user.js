const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const error_types = require('./error_types')
const User = require('../models/UserData/user_model')
const colors = require('colors')

let controller = {
	uploadFile: (req, res, next) => {
		res.send('Felicidades, la ruta funciona')
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
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						phone_number: req.body.phone_number,
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