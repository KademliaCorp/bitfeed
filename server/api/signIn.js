var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/api/sign-in', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    
});

module.exports = router;