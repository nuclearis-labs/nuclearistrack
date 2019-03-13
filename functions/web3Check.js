const Document = require('../models/document');

function checkfound(req, res, resultObj, hashed) {
	Document.findOne({ hash: hashed }, (err, doc) => {
		if (err) {
			throw new Error(err);
		} else {
			res.render('partials/check', {
				hashed: hashed,
				result: resultObj,
				doc: doc
			});
		}
	});
}

function checknotfound(req, res, hashed) {
	Document.findOne({ hash: hashed }, (err, doc) => {
		if (err) {
			throw new Error(err);
		}
		if (doc) {
			res.render('partials/check_notmined', { hashed: req.query.hash, doc: doc });
		} else {
			res.render('partials/check_notfound', { hashed: hashed });
		}
	});
}

module.exports = { checkfound, checknotfound };
