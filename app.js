// Require packages
require('newrelic');

const express = require('express'),
	app = express(),
	PORT = process.env.PORT || 3000,
	passport = require('passport'),
	mongoose = require('mongoose'),
	User = require('./models/user'),
	LocalStrategy = require('passport-local'),
	session = require('express-session'),
	i18nexpress = require('i18n-express'),
	busboy = require('connect-busboy'),
	busboyBodyParser = require('busboy-body-parser');

// Define router Routes
var indexroutes = require('./routes/index'),
	documentroutes = require('./routes/documents');

// Connect to mongoose database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nrs', {
	useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// Set extensions to ejs format
app.set('view engine', 'ejs');

// Connect to Express Mongoose Session Store
const MS = require('express-mongoose-store')(session, mongoose);

app.use(
	require('express-session')({
		secret: process.env.session_secret || 'not so secret',
		resave: false,
		unset: 'destroy',
		store: new MS({ ttl: 3600000 }),
		saveUninitialized: false,
		cookie: { secure: false }
	})
);

app.use(busboy());
app.use(busboyBodyParser());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

app.use(
	i18nexpress({
		translationsPath: __dirname + '/locales', // <--- use here. Specify translations files path.
		siteLangs: [ 'en', 'es', 'de' ],
		browserEnable: true
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
	res.locals.texts = req.i18n_texts;
	next();
});

// Define router Routes to use.
app.use(indexroutes);
app.use(documentroutes);

app.get('*', function(req, res) {
	res.render('lost');
});

app.listen(PORT, () => console.log('Server working on ' + PORT));
