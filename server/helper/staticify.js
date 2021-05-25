const Staticify = require('staticify');
const path = require('path');
const staticify = Staticify(path.join(__dirname, '..', 'public'), {
	includeAll: true,
	sendOptions: { immutable: true }
});
module.exports = staticify;
