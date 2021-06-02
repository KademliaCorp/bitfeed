const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	const shouldReload = req.app.locals.version !== req.query.v;
	res.setHeader('Content-Type', 'text/javascript; charset=UTF-8');
	res.setHeader('Cache-Control', 'no-cache; no-store; ');
    res.end(shouldReload ? /* js */`
		if ('caches' in window) {
			(async () => {
				const keys = await caches.keys();
				keys.map(key => { console.log(key); caches.delete(key) });
				const registrations = await navigator.serviceWorker.getRegistrations();
				for(let registration of registrations) {
					await registration.unregister();
				}
				location.reload(true);
			})()
		}
	`: '');
});
;
module.exports = router;