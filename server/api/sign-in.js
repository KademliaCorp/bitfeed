var express = require('express');
var router = express.Router();

router.post('/api/sign-in', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    
});

module.exports = router;
