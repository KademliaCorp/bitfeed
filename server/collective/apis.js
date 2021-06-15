const signIn = require('../api/sign-in');

module.exports = function routes(app) {
	const API = 'api'
	app.get(`/${API}/sign-in`, signIn);

	app.use(`/${API}/*`, (req, res, next) => {
		res.status(404);
		res.end('');
	})
};