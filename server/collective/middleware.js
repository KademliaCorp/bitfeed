const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const { stat } = require('fs/promises');

module.exports = function middleware(app) {
	// view engine setup
	app.set('views', app.locals.path.view);
	app.set('view engine', 'ejs');
	app.use(compression({
		filter: (req, res) => {
			if (req.headers['x-no-compression']) { return false; }

  			return compression.filter(req, res);
		}
	}));

	app.use(logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static('public'));
};