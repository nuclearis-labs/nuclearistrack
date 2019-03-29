const express = require('express'),
	router = express.Router({ mergeParams: true }),
	User = require('../models/user'),
	passport = require('passport'),
	multer = require('multer'),
	middleware = require('../middleware/index'),
	bruteforce = require('../models/bruteforce');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get('/', (req, res) => {
	res.redirect('/home');
});

router.get('/home', (req, res) => {
	res.render('home');
});

router.get('/signup', (req, res) => {
	res.render('signup');
});

router.post('/signup', upload.none(), bruteforce.prevent, (req, res) => {
	User.register(new User({ username: req.body.username, role: req.body.role }), req.body.password, (err, user) => {
		if (err) return res.render('signup', { message: err.message });

		if (!user) return res.render('signup', { message: err.message });
		passport.authenticate('local')(req, res, () => {
			res.redirect('/');
		});
	});
});

router.get('/account', middleware.isLoggedIn, (req, res) => {
	User.findOne({ username: req.user.username }, (err, user) => {
		res.render('partials/account', { username: user.username });
	});
});

router.post('/account', upload.none(), middleware.isLoggedIn, (req, res, next) => {
	User.findByUsername(req.user.username).then((sanuser) => {
		if (sanuser) {
			sanuser.setPassword(req.body.newpwd, () => {
				sanuser.save();
				res.render('partials/pwdconfirm');
			});
		}
	});
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', upload.none(), bruteforce.prevent, (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			return res.render('login', { message: info.message });
		}
		req.logIn(user, (err) => {
			if (err) return next(err);
			req.brute.reset(() => {
				return res.redirect('/');
			});
		});
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout();
	req.session = null;
	res.clearCookie('session');
	res.redirect('/');
});

module.exports = router;
