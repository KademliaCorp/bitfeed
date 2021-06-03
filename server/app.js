require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const app = express();
const routes = require('./collective/routes');
const generators = require('./collective/generators');
const locals = require('./collective/locals');
const middleware = require('./collective/middleware');
const apis = require('./collective/apis');

(async () => {
	// generate prefetch & hash version
	await generators(app);

	// set locals
	locals(app);

	// setup middleware
	middleware(app);

	//apply routes
	routes(app);

	apis(app);
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
