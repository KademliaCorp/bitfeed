const signIn = require('../api/sign-in');

module.exports = function routes(app) {
	const API = 'api'
	app.use(`/${API}/sign-in`, signIn);
};