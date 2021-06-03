require('dotenv').config();
const postgres = require('postgres');
const env = process.env;
//const uri = `postgres://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/bitfeed`
module.exports = function db() {
	return postgres({
		host: env.DB_HOST,
		port: env.DB_PORT,
		username: env.DB_USER,
		password: env.DB_PASS,
		database: 'bitfeed',
	});
}