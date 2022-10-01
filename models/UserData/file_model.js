const mongoose = require('mongoose')
const config = require('../config')

var Schema = mongoose.Schema

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
		type : Date,
		required: true
	},
	last_update_time: {
		type : Date,
		required: true
	},
	coordinador: {
		type: String,
		required: false
	},
	keywords: [{
		type: String,
		required: true
	}],
	abstract: {
		type: String,
		required: true
	},
	pdf: {
		data: Buffer,
	}
	
})

module.exports = mongoose.model(config.SchemasNames.file, FileSchema, 'files')