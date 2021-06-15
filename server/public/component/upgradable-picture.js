
window.customElements.define(
	'upgradable-picture',
	class UpgradablePicture extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
			this._update();
			this._addEventListeners();
		}

		static get observedAttributes() {
    		return [ 'thumbnail', 'fallback', 'description', 'fit' ];
  		}

		attributeChangedCallback(name, _old, _new) {
			if (_old === _new) { return; }

			clearTimeout(this._dbcUpdate);
			this._dbcUpdate = setTimeout(() => this._update(), 0);
		}

		get thumbnail() {
			return this.getAttribute('thumbnail');
		}
		set thumbnail(value) {
			this.setAttribute('thumbnail', value);
		}

		get fallback() {
			return this.getAttribute('fallback');
		}
		set fallback(value) {
			this.setAttribute('fallback', value);
		}

		get description() {
			return this.getAttribute('description');
		}
		set description(value) {
			this.setAttribute('description', value);
		}

		get fit() {
			return this.getAttribute('fit');
		}
		set fit(value) {
			this.setAttribute('fit', value);
		}

		_update() {
			const thumbnail = this.getAttribute('thumbnail');
			const fallback = this.getAttribute('fallback');
			const description = this.getAttribute('description');
			const fit = this.getAttribute('fit');

			const template = document.createElement('template');
			template.innerHTML = /* html */ `
				<style>
					* {
						box-sizing: border-box;
						padding: 0;
						margin: 0;
					}
					
					:host { display: block; }
					:host([hidden]) { display: none; }

					img.thumbnail {
						width: 100%;
						height: 100%;
						object-fit: ${ fit || 'cover' };
					}

					img, picture {
						filter: blur(0.5em);
					}
					
					img.fallback, picture {
						width: 100%;
						height: 100%;
						object-fit: ${fit};
						transition: filter 200ms linear;
					}

					img.fallback.loaded, picture.loaded {
						filter: blur(0);
					}
				</style>
				<picture>
					<slot></slot>
				</picture>
				<img class="thumbnail" src="${thumbnail}" alt="${description}">
			`;

			this.shadowRoot.innerHTML = '';
			this.shadowRoot.appendChild(template.content.cloneNode(true));

			const slot = this
				.shadowRoot
				.querySelector('slot');

			const picture = this
				.shadowRoot
				.querySelector('picture');

			Array
				.from(slot.assignedNodes())
				.map(node => node.cloneNode(true))
				.forEach(node => picture.appendChild(node));
			
			const $fallback = document.createElement('img');
			$fallback.classList.add('fallback');
			$fallback.src = fallback;
			$fallback.alt = description;
			$fallback.setAttribute('hidden', '');

			const $thumbnail = this
				.shadowRoot
				.querySelector('img.thumbnail');

			$fallback.onload = () => {
				$fallback.removeAttribute('hidden');
				$thumbnail.setAttribute('hidden', '');
				$fallback.classList.add('loaded');
				picture.classList.add('loaded');
			};
			
			picture.appendChild($fallback);
		}

		_addEventListeners() {
			const slot = this
				.shadowRoot
				.querySelector('slot');

			slot.addEventListener('slotchange', () => { try { this._update(); } catch {} });
		}
	}
);


