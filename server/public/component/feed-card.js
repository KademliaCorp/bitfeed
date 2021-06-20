
export const FEED_CHANGED = '@feed-card/feed-changed';

const css = /* css */ `
	* { box-sizing: border-box; }
	:host { display: flex; }
	:host([hidden]) { display: none; }
	article {
		display: grid;
		grid-template-rows: 17em 6em;
		background-color: var(--color-primary-darkest);
		box-shadow: 0px 2px 5px -3px #000000;
		border-radius: 6px;
		border: solid 4px transparent;
		overflow: hidden;
		cursor: pointer;
		transition : border-color 100ms linear;
		color: var(--color-primary-lighter);
	}

	article:hover {
		border: solid 4px var(--accent-color);
	}

	article header {
		padding: 1em;
		margin: auto auto;
	}

	.gradient-wrapper {
		position: relative;
		overflow: hidden;
	}

	.gradient-wrapper upgradable-picture {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}

	.gradient-wrapper upgradable-picture:before {
		content: '';
		background-image: linear-gradient(to top, var(--color-primary-darkest), var(--color-primary-darkest-t));
		position: absolute;
		height: 4em;
		right: 0;
		bottom: 0em;
		left: 0;
		z-index: 1;
	}

	.gradient-wrapper upgradable-picture:after {
		content: '';
		display: block;
	}

	article h2 {
		margin: 0;
		text-transform: uppercase;
	}

	a {
		display: block;
		width: 100%;
		height: 100%;
		text-decoration: none;
	}
`;


const template = document.createElement('template');
template.innerHTML = /* html */ `
	<style>${css}</style>
	<script type="module" src="/component/upgradable-picture.js"></script>
	<script type="module" src="/component/a-link.js"></script>
	<a class="link-wrapper" is="a-link">
		<article>
			<div class="gradient-wrapper">
				<!-- <upgradable-picture
					thumbnail="/image/large_tree_thumb.jpeg"
					fallback="/image/large_tree.jpeg"
					description="A large oak tree"
					fit="cover"
				>
					<source media="(min-width: 1000px)" srcset="/image/large_tree_reddish.jpeg">
				</upgradable-picture> -->
				<upgradable-picture>
				</upgradable-picture>
			</div>
			<header>
				<h2>A short heading</h2>
			</header>    
		</article>
	</a>
`;

window.customElements.define(
	'feed-card',
	class FeedCard extends HTMLElement {
		static config = {
			feedPrefix: '/feed',
			fetchPrefix: '/api',
			imIdPath: 'imid',
			fetcher: fetch,
		};
		
		static get observedAttributes() {
			return [ 'feed-id', 'im-id', 'feed-title', 'feed-description', 'feed-pictures', 'feed-preview' ];
		}

		constructor() {
			super();
			const shadowRoot = this.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(template.content.cloneNode(true));
			this._addEventListeners();
		}


		attributeChangedCallback(name, _old, _new) {
			if (_old === _new) { return; }

			this[`${name}_changed`](_new);
		}

		_addEventListeners() { }

		get feedId() {
			return this.getAttribute('feed-id');
		}
		set feedId(value) {
			this.setAttribute('feed-id', value);
		}
		['feed-id_changed']() {
			const link = this
					.shadowRoot
					.querySelector('a.link-wrapper');
			link.href = `${ FeedCard.config.feedPrefix }/${ this.feedId }`;
		}

		get imId() {
			return this.getAttribute('im-id');
		}
		set imId(value) {
			this.setAttribute('im-id', value);
		}
		async ['im-id_changed']() {
			const imId = this.imId;
			if (!imId) { return; }

			const config = FeedCard.config;
			const fetch = config.fetcher;
			try {
				const response = await fetch(`${ config.fetchPrefix }/${ config.imIdPath }/${ imId }`);
				const feed = await response.json();
				this.feed = feed;
			} catch (err) { console.log(err); }
		}

		get feedTitle() {
			return this.getAttribute('feed-title');
		}
		set feedTitle(value) {
			this.setAttribute('feed-title', value);
		}
		['feed-title_changed'](value) {
			this
				.shadowRoot
				.querySelector('header h2')
				.textContent = value;
		}

		get feedDescription() {
			return this.getAttribute('feed-description');
		}
		set feedDescription(value) {
			this.setAttribute('feed-description', value);
		}
		['feed-description_changed'](value) {
			const images = this
				.shadowRoot
				.querySelectorAll('img, picture')
			Array
				.from(images)
				.forEach(image => image.alt = value);
		}

		get feedPictures() {
			return this.getAttribute('feed-pictures');
		}
		set feedPictures(value) {
			this.setAttribute('feed-pictures', value);
		}
		['feed-pictures_changed'](value) {
			try {
				
				/* We are expecting the following
					{
						thumbnail: url,
						fallback: 'default.jpg',
						description: 'this is some default stuff',
						sources: [
							{ type: 'image/avif', media: '(min-width:465px)', src: 'large.avif' },
							{ srcset: 'something.png' },
						],
					}
				*/
				const feedPictures = JSON.parse(value);
				if (!feedPictures) { return; }

				const picture = this
						.shadowRoot
						.querySelector('upgradable-picture');
				picture.thumbnail = feedPictures.thumbnail;
				picture.fallback = feedPictures.fallback;
				picture.description = feedPictures.description;
				picture.innerHTML = '';
				if (Array.isArray(feedPictures.sources)) {
					sources
						.filter(source => !!source && typeof source === 'object') 	// remove empty
						.map(source => {
							const el = document.createElement('source');
							if (source.type) { el.type = source.type; }
							if (source.src) { el.srcset = source.src; }
							if (source.media) { el.media = source.media; }

							return el;
						})
						.forEach(source => picture.appendChild(source));
				}

			} catch (err) { console.log(error); }
		}

		get feed() { return this._feed }
		set feed(value) { 
			if (value === this._feed) { return; }

			const old = this._feed;
			this._feed = value;
			this.dispatchEvent(new CustomEvent(FEED_CHANGED, { detail: { old, new: value } }));
			this._updateFeed(value);
		}

		_updateFeed(feed) {
			this.feedId = feed.id;
			this.feedTitle = feed.title;
			this.feedDescription = feed.description;
			this.feedPictures = feed.pictures;
		}
	}
);


