const express = require('express'),
	router = express.Router({ mergeParams: true }),
	Document = require('../models/document'),
	multer = require('multer'),
	web3Hash = require('../models/web3Hash'),
	hash = require('../models/hash'),
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

router.get('/list/', isLoggedIn, function(req, res) {
	let perpage = 10;
	let page;
	if (req.query.cc && req.query.cc !== 'all') query = { $and: [ { proyecto: req.query.cc }, { visible: true } ] };
	else if (req.query.cc == 'all') query = { visible: true };
	else query = { visible: true };

	if (req.query.page == undefined) {
		page = 1;
	} else {
		page = req.query.page;
	}

	Document.countDocuments({}, function(err, countDoc) {
		if (err) {
			res.render('partials/error', { error: err });
		}
		Document.find(query, function(err, doc) {
			if (err) {
				console.log(err);
			} else {
				res.render('list', { list: doc, countDoc: countDoc, perpage: perpage, page: page });
			}
		})
			.skip(req.query.page > 0 ? (req.query.page - 1) * perpage : 0)
			.limit(perpage)
			.sort('-proyecto');
	});
});

router.post('/hash', isLoggedIn, upload.single('newhash'), function(req, res, next) {
	hash.create(req.file.path, function(err, hashed) {
		if (err) {
			res.render('partials/error', { error: err });
		}
		web3Hash.find(hashed, function(error, resultObj) {
			if (error) {
				res.render('partials/error', { error: error });
			}
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
				Document.findOne({ hash: hashed }, function(err, doc) {
					if (err) {
						res.render('partials/error', { error: err });
					}
					if (doc) {
						res.render('partials/check_notmined', {
							hashed: hashed,
							result: resultObj,
							doc: doc
						});
					} else {
						web3Hash.send(hashed, req.body.id, req.file.filename, req.body.cc, req.user.username, function(
							error,
							result
						) {
							if (error) {
								res.render('partials/error', { error: error });
							}
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
			}
		});
	});
});

router.post('/check', isLoggedIn, upload.single('newhash'), function(req, res, next) {
	hash.create(req.file.path, function(err, hashed) {
		if (err) {
			res.render('partials/error', { error: err });
		}
		//Call findHash function with the hex hash and await the result for rendering the check hash page
		web3Hash.find(hashed, function(error, resultObj) {
			if (error) {
				res.render('partials/error', { error: error });
			}
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
				Document.findOne({ hash: hashed }, function(err, doc) {
					if (err) {
						console.log('Got: ' + err);
					}
					if (doc) {
						res.render('partials/check_notmined', { hashed: hashed, doc: doc });
					} else {
						res.render('partials/check_notfound', { hashed: hashed });
					}
				});
			}
		});
	});
});

router.get('/check', isLoggedIn, function(req, res, next) {
	//Call findHash function with the hex hash and await the result for rendering the check hash page
	web3Hash.find(req.query.hash, function(error, resultObj) {
		if (error) {
			res.render('partials/error', { error: error });
		}
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
			Document.findOne({ hash: req.query.hash }, function(err, doc) {
				if (err) {
					console.log('Got: ' + err);
				}
				if (doc) {
					res.render('partials/check_notmined', { hashed: hashed, doc: doc });
				} else {
					res.render('partials/check_notfound', { hashed: hashed });
				}
			});
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
