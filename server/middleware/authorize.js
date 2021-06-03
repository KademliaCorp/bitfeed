const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) { return res.sendStatus(401); }

	jwt.verify(token, process.env.TOKEN_SECRET, (err, jwt) => {
		console.log(err)

		if (err) { return res.sendStatus(403); }

		req.user = jwt;
		next();
	})
}
