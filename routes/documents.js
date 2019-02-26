const express = require('express'),
	router = express.Router({ mergeParams: true }),
	Document = require('../models/document'),
	multer = require('multer'),
	web3functions = require('../models/web3func'),
	MO_find = web3functions.MO_find,
	MO_send = web3functions.MO_send,
	hashfunctions = require('../models/hash'),
	hash = hashfunctions.hash,
	middleware = require('../middleware/index'),
	isLoggedIn = middleware.isLoggedIn;

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function(req, file, cb) {
		let ext = file.originalname.slice(-3);
		cb(null, req.user.username + '-' + '2320' + '-' + Date.now() + '.' + ext);
	}
});

const upload = multer({ storage: storage });

router.get('/hash', isLoggedIn, function(req, res) {
	res.render('hash');
});

router.get('/list', isLoggedIn, function(req, res) {
	var list = undefined;

	Document.find({ username: req.user.username }, function(err, doc) {
		if (err) {
			console.log('Something went wrong');
		} else {
			res.render('list', { list: doc });
		}
	});
});

router.post('/hash', isLoggedIn, upload.single('newhash'), function(req, res, next) {
	hash(req.file.path, function(err, hashed) {
		MO_find(hashed, function(error, resultObj) {
			if (resultObj.blockNumber != 0) {
				Document.findOne({ hash: hashed }, function(err, doc) {
					if (err) {
						console.log('Got: ' + err);
					} else if (doc.visible === false) {
						Document.updateOne({ hash: hashed }, { $set: { visible: true } }, function(err, update) {
							if (err) {
								console.log('Error: ' + err);
							}
							res.render('partials/add_db', {
								doc: doc,
								hashed: hashed,
								result: resultObj
							});
						});
					} else {
						console.log(doc);
						res.render('partials/check_duplicate', {
							hashed: hashed,
							result: resultObj,
							doc: doc
						});
					}
				});
			} else {
				//Call MO_send function with the hex hash and await the result for rendering the hash page
				MO_send(hashed, req.body.id, req.file.filename, req.body.cc, req.user.username, function(
					error,
					result
				) {
					if (result) {
						res.render('partials/hash', {
							hashed: hashed,
							docid: req.body.id,
							result: result
						});
					}
				});
			}
		});
	});
});

router.post('/check', isLoggedIn, upload.single('newhash'), function(req, res, next) {
	hash(req.file.path, function(err, hashed) {
		//Call MO_find function with the hex hash and await the result for rendering the check hash page
		MO_find(hashed, function(error, resultObj) {
			if (resultObj.blockNumber != 0) {
				Document.findOne({ hash: hashed }, function(err, doc) {
					if (err) {
						console.log('Got: ' + err);
					} else {
						res.render('partials/check', {
							hashed: hashed,
							result: resultObj,
							doc: doc
						});
					}
				});
			} else {
				res.render('partials/check_notfound', { hashed: hashed });
			}
		});
	});
});

router.get('/check', isLoggedIn, function(req, res, next) {
	//Call MO_find function with the hex hash and await the result for rendering the check hash page
	MO_find(req.query.hash, function(error, resultObj) {
		if (resultObj.blockNumber != 0) {
			Document.findOne({ hash: req.query.hash }, function(err, doc) {
				if (err) {
					console.log('Got: ' + err);
				} else {
					res.render('partials/check', {
						hashed: req.query.hash,
						result: resultObj,
						doc: doc
					});
				}
			});
		} else {
			res.render('partials/check_notfound', { hashed: req.query.hash });
		}
	});
});

router.get('/delete', isLoggedIn, function(req, res, next) {
	Document.updateOne({ hash: req.query.hash }, { $set: { visible: false } }, function(err, doc) {
		if (err) {
			console.log('Got: ' + err);
		} else {
			res.render('partials/delete', {
				hashed: req.query.hash,
				doc: doc
			});
		}
	});
});

module.exports = router;
