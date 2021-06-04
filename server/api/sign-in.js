const express = require('express');
const router = express.Router();
const User = require('../repository/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hash_rounds = parseInt(process.env.HASH_ROUNDS);

router.post('/', async (req, res, next) => {
	const { username, password, difficulty, salt } = req.body;
	const creds = await User.getCredentialsByUsername(username);
	bcrypt.compare(password, creds.password, function(err, matches) {
		if (!matches) {
			return res
				.json({ loggedIn: false, message: 'auth/invalid' })
				.end();
		}
		
		const token = jwt.sign({ username: username }, process.env.JWT_SECRET);
		res.cookie('jwt', token, { httpOnly: true });
		res.cookie('signed-in', true);
		res.cookie('SameSite', 'Strict');
		res.cookie('Secure', null);
			return res
				.json({ loggedIn: true })
				.end();
	});
});

module.exports = router;
