const css = /* css */ `
	* { box-sizing: border-box; }
	:host {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	:host([hidden]) { display: none }

	label {
		text-transform: uppercase;
		color: var(--primary-text-color);
		letter-spacing: 1.1px;
	}

	label, input {
		width: 100%;
	}

	input {
		background: var(--color-primary-light);
		font-size: 1.1rem;
		color: var(--primary-text-color);
		height: 2.25em;
		padding-left: 0.75em;
		border-radius: 4px;
		border: solid transparent 1px;
	}

	input:focus {
		background: var(--color-primary-light);
		border: solid var(--accent-color) 1px;
		outline: none;
	}

	:host([state="invalid"]) input {
		border-color: var(--color-invalid);
	}

	:host([state="invalid"]) label {
		color: var(--color-invalid);
	}
`;


const template = document.createElement('template');
template.innerHTML = /* html */ `
	<style>${css}</style>
	<label for="input-field"></label>
	<input id="input-field" type="text" title="" placeholder="" autofocus />
`;


window.customElements.define(
	'input-field',
	class SignIn extends HTMLElement {
		constructor() {
			super();
			const shadowRoot = this.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(template.content.cloneNode(true));
			this._syncAttributes();
			this._addEventListeners();
		}

		static get observedAttributes() {
    		return [ 'label', 'value', 'placeholder', 'autofocus' ];
  		}

		attributeChangedCallback(name, _old, _new) {
			if (_old === _new) { return; }

			switch (name) {
				case 'label':
					this
						.shadowRoot
						.querySelector('label')
						.textContent = _new;
					break;
				case 'value':
					const input = this
						.shadowRoot
						.querySelector('input');
					if (input.value === _new) { return; }

					input.value = _new;
					break;
				case 'type':
					this
						.shadowRoot
						.querySelector('input')
						.type = _new;
					break;
				case 'placeholder':
					this
						.shadowRoot
						.querySelector('input')
						.placeholder = _new;
					break;
				case 'autofocus':
					this
						.shadowRoot
						.querySelector('input')
						.autofocus = this.autofocus;
					break;
				default:
					break;
			}
		}

		_syncAttributes() {
			this
				.shadowRoot
				.querySelector('label')
				.textContent = this.getAttribute('label');

			this
				.shadowRoot
				.querySelector('input')
				.value = this.getAttribute('value');

			this
				.shadowRoot
				.querySelector('input')
				.type = this.getAttribute('type');

			this
				.shadowRoot
				.querySelector('input')
				.placeholder = this.getAttribute('placeholder');

			this
				.shadowRoot
				.querySelector('input')
				.autofocus = this.autofocus;
		}

		_addEventListeners() {
			const input = this
				.shadowRoot
				.querySelector('input');

				input.addEventListener('input', (e) => this.setAttribute('value', input.value));
		}

		get value() {
			return this.getAttribute('value');
		}
	}
);
