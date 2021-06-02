const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const immutable_route = require('./middleware/immutable-route');
const versioned_route = require('./middleware/versioned-route');

module.exports = function middleware(app) {
	// view engine setup
	app.set('views', app.locals.path.view);
	app.set('view engine', 'ejs');

	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());

	app.use(express.static('public'));
	// app.use(immutable_route);
	// app.use(`/:version/*`, versioned_route);
};