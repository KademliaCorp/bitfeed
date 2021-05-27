const path = require('path');
const public = path.join(__dirname, 'public');
const view = path.join(__dirname, 'view');
const db = require('./db');

module.exports = function locals(app) {
	app.locals.db_connection = db;
	app.locals.path = { public, view };
	app.locals.env = process.env;
	app.locals.public_salt = process.env.PUBLIC_SALT;
	app.locals.isDev = app.get('env') === 'development';
};