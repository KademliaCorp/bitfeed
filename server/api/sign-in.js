const express = require('express');
const router = express.Router();
const User = require('../repository/user');
const bcrypt = require('bcrypt');

router.post('/', async (req, res, next) => {
	const { username, password, difficulty, salt } = req.body;
	const creds = User.getCredentialsByUsername(username);
	bcrypt.compare(password, creds.password, function(err, matches) {
		// result == true
		if (!matches) {
			return res
				.json({ loggedIn: false, message: 'auth/invalid' })
				.end();
		}

		const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
		res.cookie('jwt', token, { httpOnly: true });
	});
});

module.exports = router;
