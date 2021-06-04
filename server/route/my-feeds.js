const express = require('express');
const router = express.Router();
const staticify = require('../helper/staticify');

router.get('/', function(req, res, next) {
	// if (req.header('if-none-match')) {
	// 	res.sendStatus(304);
	// 	return res.end();
	// }
	// res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
	res.render('my-feeds', { immutable: staticify.getVersionedPath });
});

module.exports = router;
