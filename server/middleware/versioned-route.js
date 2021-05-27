
module.exports = async (req, res, next) => {
	if (req.path.startsWith('/api') || req.path.startsWith('/updater')) { return next(); }

	const version = req.app.locals.version;
	if (req.params.version === version) {
		if (req.header('if-none-match')) {
			res.sendStatus(304);
			return res.end();
		}

		res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
		return next();
	}

	const route = Object
		.entries(req.params)
		.map(entry => [parseInt(entry[0]), entry[1]])
		.filter(entry => !isNaN(parseInt(entry[0])))
		.sort((a, b) => a[0] - b[0])
		.map(entry => entry[1])
		.join('/');

	res.redirect(`/${version}/${route}`);
}
