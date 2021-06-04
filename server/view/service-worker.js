
// import "prefetches"
const prefetches = Object.keys(<%- include('./generated/prefetches') %>);
const routes = [
	'/sign-in',
	'/explore',
	'/my-feeds',
	'/create',
];
const toCache = [ ...prefetches, ...routes ];
let cachable = toCache.reduce((c, n) => { c[n] = true; return c; }, {});

const CACHE_NAME = "<%= version %>";

self.addEventListener('install', function(event) {
	event.waitUntil((async () => {
		const keys = await caches.keys();
		await Promise.all(
			keys
				.map(key => { return key; })
				.filter(key => key !== CACHE_NAME)
				.map(key => { return caches.delete(key); })
		);

		const cache = await caches.open(CACHE_NAME);
		return await cache.addAll(toCache);
	})())
});

self.addEventListener('fetch', async function(event) {
	try {
		event.respondWith(
			(async () => {
				try {
					const cache = await caches.open(CACHE_NAME);
					let response = await cache.match(event.request);
					if (response) { return response; }

					response = await fetch(event.request);
					if (new URL(event.request.url).pathname in cachable) {
						await cache.put(event.request, response.clone());
					} 
					return response;
				}
				catch (error) {
					console.error(error);
					return await fetch(event.request); 
				} 
			})()
		)
	}
	catch(error) {
		console.error(error);;
		event.respondWith(fetch(event.request));
	}
});