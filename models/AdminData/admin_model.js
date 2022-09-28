'use strict'
const mongoose = require('mongoose')
const config = require('../config')

var Schema = mongoose.Schema

var AdminSchema = Schema({
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
	user_type: {
		type: Boolean,
		default: true
	}
})

module.exports = mongoose.model(config.SchemasNames.admin, AdminSchema, 'admins')