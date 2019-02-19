var mongoose = require('mongoose'),
	ExpressBrute = require('express-brute'),
	MongooseStore = require('express-brute-mongoose'),
	BruteForceSchema = require('express-brute-mongoose/dist/schema');

var brutemodel = mongoose.model('bruteforce', new mongoose.Schema(BruteForceSchema));
var brutestore = new MongooseStore(brutemodel);

module.exports = new ExpressBrute(brutestore);
