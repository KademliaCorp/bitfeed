const express = require('express');
const router = express.Router();
const staticify = require('../helper/staticify');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', immutable: staticify.getVersionedPath });
});

module.exports = router;
