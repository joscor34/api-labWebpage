'use strict'
const moongose = require('mongoose')
const config = require('../config')

var Schema = moongose.Schema

var UserSchema = Schema({
	first_name: {
		type: String,
		required: true
	}, 
	last_name:{
		type: String,
		required: true
	},
	email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
	},
	user_type: {
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model(config.SchemasNames.user, UserSchema, 'users')