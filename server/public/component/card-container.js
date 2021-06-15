
const css = /* css */ `
	* { box-sizing: border-box; }
	:host {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16em, 1fr));
		grid-gap: 1em;
	}
`;


const template = document.createElement('template');
template.innerHTML = /* html */ `
	<style>${css}</style>
	<slot></slot>
`;

window.customElements.define(
	'card-container',
	class CardContainer extends HTMLElement {
		constructor() {
			super();
			const shadowRoot = this.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(template.content.cloneNode(true));
			this._addEventListeners();
		}

		_addEventListeners() {
			
		}
	}
);


