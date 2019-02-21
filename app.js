// Require packages
const express = require('express'),
	app = express(),
	PORT = process.env.PORT || 3000,
	passport = require('passport'),
	mongoose = require('mongoose'),
	User = require('./models/user'),
	LocalStrategy = require('passport-local'),
	session = require('express-session');

app.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});

// Define router Routes
var indexroutes = require('./routes/index'),
	documentroutes = require('./routes/documents');

// Connect to mongoose database
mongoose.connect(process.env.database_url || 'mongodb://localhost/mo_nrs', {
	useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Set extensions to ejs format
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to Express Mongoose Session Store
const MS = require('express-mongoose-store')(session, mongoose);

app.use(
	require('express-session')({
		secret: 'oomph quant brake linseed vitrics deicide abandon piping playboy yataghan',
		resave: false,
		unset: 'destroy',
		store: new MS({ ttl: 60000 }),
		saveUninitialized: false
	})
);

// Define passport.JS and initiate objects
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Define user as local request object named currentUser
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

// Define router Routes to use.
app.use(indexroutes);
app.use(documentroutes);

app.get('*', function(req, res) {
	res.render('lost');
});

app.listen(PORT, () => console.log('Server working on ' + PORT));
