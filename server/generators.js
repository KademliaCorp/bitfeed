const path = require('path');
const fs = require('fs');
const recursive = require('recursive-readdir');
const XXHash = require('xxhash');
const base62 = require('base62/lib/ascii');
const hasher = new XXHash(0xCAFEBABE);
const public = path.join(__dirname, 'public');
const view = path.join(__dirname, 'view');

module.exports = async function generators(app) {

	// generate app version based on hashes
	await new Promise((res, rej) => {
		recursive(__dirname, function (err, files) {
			if (err) { return rej(err); }
	
			console.time('Hashing');
			files
				.sort()
				.forEach((file) => hasher.update(fs.readFileSync(file)));
			const version = base62.encode(hasher.digest());
			console.timeEnd('Hashing')
			console.log(`Hash Version: ${version}`);
			fs.writeFileSync('./version', version);
			app.locals.version = version;
			res()
		});
	});

	// build prefetch links
	await (async function prefetches() {
		const prefetches = (await recursive(public, ['.css', '.js', '.html']))
			.sort()
			.map(file => `<link rel="prefetch" href="<%= immutable('${file.replace(public, '')}') %>">`);
		
		fs.writeFileSync(path.join(view, 'generated', 'prefetches.ejs'), prefetches.join('\n'));
	})();
}
