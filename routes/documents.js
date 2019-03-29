const express = require('express'),
	router = express.Router({ mergeParams: true }),
	Document = require('../models/document'),
	web3 = require('../functions/web3'),
	list = require('../functions/list'),
	mail = require('../functions/mail'),
	multer = require('multer'),
	hash = require('../functions/hash'),
	middleware = require('../middleware/index');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get('/upload', middleware.isLoggedIn, (req, res) => {
	res.render('upload');
});

router.get('/verify', middleware.isLoggedIn, (req, res) => {
	res.render('verify');
});

router.get('/list/', middleware.isLoggedIn, (req, res) => {
	let perpage = 10;
	let page = list.getPage(req.query.page);
	let query = list.queryRole(req.user.role, req.query.cc, req.user.username);
	list.renderlist(req, res, query, perpage, page);
});

router.post(
	'/hash',
	upload.single('newhash'),
	middleware.isLoggedIn,
	middleware.asyncMiddleware(async (req, res, next) => {
		let file = req.file;
		let hashed = await hash.create(file.buffer);

		let ext = file.originalname.split('.');
		let fileName = req.user.username + '-' + req.body.cc + '-' + Date.now() + '.' + ext[ext.length - 1];

		let resultObj = await web3.find(hashed);
		console.log(resultObj);
		if (resultObj.blockNumber == 0) {
			let s3 = await hash.uploadToS3(file.buffer, fileName);
		}
		let block = await web3.block(hashed, resultObj, req.body.id);
		if (block.page == 'partials/hash') {
			mail.sendMail('smartinez@nuclearis.com', req.body.id, req.body.cc, req.user.username);
			await Document.create({
				id: req.body.id,
				hash: hashed,
				tx: block.result,
				filename: fileName,
				proyecto: req.body.cc,
				mined: false,
				visible: true,
				username: req.user.username
			});
		}
		res.render(block.page, block.data);
	})
);

router.post(
	'/check',
	upload.single('newhash'),
	middleware.isLoggedIn,
	middleware.asyncMiddleware(async (req, res, next) => {
		let file = req.file;
		let hashed = await hash.create(file.buffer);

		let resultObj = await web3.find(hashed);
		let check = await web3.check(resultObj, hashed);
		res.render(check.page, check.data);
	})
);

router.get(
	'/check',
	middleware.isLoggedIn,
	middleware.asyncMiddleware(async (req, res, next) => {
		let resultObj = await web3.find(req.query.hash);
		let check = await web3.check(resultObj, req.query.hash);
		res.render(check.page, check.data);
	})
);

router.get('/delete', middleware.isLoggedIn, (req, res, next) => {
	Document.updateOne({ hash: req.query.hash }, { $set: { visible: false } }, (err, doc) => {
		res.render('partials/delete', {
			hashed: req.query.hash,
			doc: doc
		});
	});
});

module.exports = router;
