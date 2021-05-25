const path = require('path');
const staticify = require('../helper/staticify');
const fs = require('fs');

const cache = {};
const whitelist = [ '.js', '.css', '.html' ];
module.exports = function immutable(req, res, next) {
	const ext = path.extname(req.path).toLocaleLowerCase();
	if (whitelist.includes(ext)) {
		switch (ext) {
			case '.js':
				res.setHeader('Content-Type', 'text/javascript; charset=UTF-8');
				break;
			case '.css':
				res.setHeader('Content-Type', 'text/css; charset=UTF-8');
				break;
			case '.html':
				res.setHeader('Content-Type', 'text/html; charset=UTF-8');
			default:
				break;
		}
		res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
		if (req.path in cache) {
			return res.end(cache[req.path]);
		}

		fs.readFile(path.join(__dirname, '..', 'public', staticify.stripVersion(req.path)), { encoding: 'utf-8' }, (err, template) => {
			try {
				const rendered = staticify.replacePaths(template);
				cache[req.path] = rendered;
				return res.end(rendered);
			} catch (error) {
				next();
			}
			if (err) {
				return staticify.middleware.call(this, req, res, next);			
			}
		});
		return;
	}

	staticify.middleware.call(this, req, res, next);
}