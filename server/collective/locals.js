const path = require('path');
const public = path.normalize(path.join(__dirname, '..', 'public'));
const view = path.normalize(path.join(__dirname, '..','view'));
const db = require('../db');

module.exports = function locals(app) {
	app.locals.db_connection = db;
	app.locals.path = { public, view };
	app.locals.env = process.env;
	app.locals.public_salt = process.env.PUBLIC_SALT;
	app.locals.tumble_difficulty = process.env.TUMBLE_DIFFICULTY;
	app.locals.is_dev = app.get('env') === 'development';
};