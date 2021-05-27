require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const immutable_route = require('./middleware/immutable-route');
const versioned_route = require('./middleware/versioned-route');
const recursive = require('recursive-readdir');
const fs = require('fs');
const app = express();
const routes = require('./routes');
const generators = require('./generators');
const locals = require('./locals');
const middleware = require('./middleware');

(async () => {
	// generate prefetch & hash version
	await generators(app);

	// set locals
	locals(app);

	// setup middleware
	middleware(app);

	//apply routes
	routes(app);

	// app.use('/', (req, res, next) => res.redirect(`/${config.version}`));

	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('error');
	});
})()
module.exports = app;
