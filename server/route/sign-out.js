const express = require('express');
const router = express.Router();
const staticify = require('../helper/staticify');

router.get('/', function(req, res, next) {
	res.clearCookie('jwt');
	res.clearCookie('signed-in');
	res.redirect('/explore');
	res.end();
});

module.exports = router;