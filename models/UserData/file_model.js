const moongose = require('mongoose')
const config = require('../config')

var Schema = moongose.Schema

var FileSchema = Schema({
	_userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	paper: {
		type: Number,
		required: true
	},
	authors: [{
		autor: {
			type: String,
			required: true
		},
		country: {
			type: String,
			required: true
		},
		affilation: {
			type: String,
			required: true
		},
	}],
	title: {
		type: String,
		required: true
	},
	submitted_time: {
		type : Number  //Por revisar el tipo
	},
	last_update_time: {
		type : Number  //Por revisar el tipo
	},
	coordinador: {
		type: String,
		required: false
	},
	keywords: [{
		keyword: {
			type: String,
			required: true
		}
	}],
	abstract: {
		type: String,
		required: true
	}
	
})