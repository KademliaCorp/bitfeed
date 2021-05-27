const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	const shouldReload = req.app.locals.version !== req.query.v;
	res.setHeader('Content-Type', 'text/javascript; charset=UTF-8');
	res.setHeader('Cache-Control', 'no-cache; no-store; ');
    res.end(shouldReload ? `location.reload(true);`: '');
});

module.exports = router;