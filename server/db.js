require('dotenv').config();
const postgres = require('postgres');
const env = process.env;
module.exports = function db() {
	return postgres({
		host: env.DB_HOST,
		port: env.DB_PORT,
		username: env.dev_123,
		database: 'bitfeed',
	});
}