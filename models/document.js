var mongoose = require('mongoose');

var docSchema = new mongoose.Schema({
	id: String,
	hash: String,
	tx: String,
	mined: Boolean,
	username: String
});

module.exports = mongoose.model('Document', docSchema);