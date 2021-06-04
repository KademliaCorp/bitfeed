const express = require('express');
const router = express.Router();
const staticify = require('../helper/staticify');
const ejs = require('ejs');
const path = require('path');

router.get('/', async (req, res, next) => {
	const version = req.app.locals.version;
	const etag = req.header('if-none-match');
	if (etag === version) {
		res.sendStatus(304);
		return res.end();
	}

	if (etag && etag !== version) {
		return res.redirect(`/service-worker?v=${version}`);
	}

	const result = await ejs.renderFile(path.join(req.app.locals.path.view, 'service-worker.js'), req.app.locals);
	res.setHeader('ETag', version);
	res.setHeader('Content-Type', 'text/javascript; charset=UTF-8');
	res.end(result);
});

module.exports = router;
