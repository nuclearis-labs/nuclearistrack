var mongoose = require('mongoose');

var docSchema = new mongoose.Schema({
	id: String,
	hash: String,
	tx: String,
	proyecto: Number,
	filename: String,
	mined: Boolean,
	visible: Boolean,
	username: String
});

module.exports = mongoose.model('Document', docSchema);
