const path = require('path');
const fs = require('fs');
const recursive = require('recursive-readdir');
const XXHash = require('xxhash');
const base62 = require('base62/lib/ascii');
const hasher = new XXHash(0xCAFEBABE);
const sha256File = require('sha256-file');
const public = path.normalize(path.join(__dirname, '..', 'public'));
const view = path.normalize(path.join(__dirname, '..','view'));

module.exports = async function generators(app) {

	// generate app version based on hashes
	await new Promise((res, rej) => {
		if (fs.existsSync('../version')) { fs.unlinkSync('../version'); }
		recursive(path.normalize(path.join(__dirname, '..')), function (err, files) {
			if (err) { return rej(err); }
	
			console.time('Hashing');
			files
				.sort()
				.forEach((file) => hasher.update(fs.readFileSync(file)));
			const version = base62.encode(hasher.digest());
			console.timeEnd('Hashing')
			console.log(`Hash Version: ${version}`);
			fs.writeFileSync('../version', version);
			app.locals.version = version;
			res()
		});
	});

	// build prefetch links
	await (async function prefetches() {
		const prefetches = (await recursive(public, ['.css', '.js', '.html']))
			.sort()
			//.filter(file => !file.startsWith(path.join(public, 'i18n'))) 	// don't prefetch all the language files
			.map(file => [ file.replace(public, ''), sha256File(file) ])
			.reduce((p = {}, c) => {
				p[c[0]] = Buffer.from(c[1]).toString('base64');
				return p;
			}, {});
		
		fs.writeFileSync(path.join(view, 'generated', 'prefetches.ejs'), JSON.stringify(prefetches));
	})();
}
