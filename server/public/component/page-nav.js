import { PubSub } from '/service/pubsub.js';

export const ON_AUTH_CHANGED = 'ON_AUTH_CHANGED';

const css = /* css */ `
	* { font-family: 'Open Sans', Arial, Helvetica, sans-serif; }

	.navbar {
		width: 100%;
		background-color: var(--primary-color, #555);
		overflow: auto;
	}

	[name="nav-item"]::slotted(*), [slot="nav-item"] {
		float: left;
		padding: 0.75rem;
		color: white;
		text-decoration: none;
		font-size: 1rem;
		text-transform: uppercase;
	}

	[name="nav-item"]::slotted(*:hover), [slot="nav-item"]:hover {
		background-color: #000;
	}

	[name="nav-item"]::slotted(.active), [slot="nav-item"].active {
		background-color: var(--accent-color, #04AA6D);
	}

	@media screen and (max-width: 500px) {
		[name="nav-item"]::slotted(*), [slot="nav-item"] {
			float: none;
			display: block;
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = /* html */ `
	<style>${css}</style>
	<nav class="navbar">
		<slot name="nav-logo">
			
		</slot>
		<slot name="nav-item">
			<a slot="nav-item" id="nav-feeds" href="/">Feeds</a> 
			<a slot="nav-item" id="nav-explore" href="/explore">Explore</a>
			<a slot="nav-item" id="nav-create" href="/create">Create</a>
			<!-- <a slot="nav-item" id="nav-profile" href="/profile">Profile</a>  -->
			<a slot="nav-item" id="nav-login" href="/login">Login</a>
		</slot>
	</nav>
`;

window.customElements.define(
	'page-nav',
	class PageNav extends HTMLElement {
		constructor() {
			super();
			const shadowRoot = this.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(template.content.cloneNode(true));
			this.init();
			this.subscribe();
		}

		init() {
			const path = window.location.pathname;
			const links = Array
				.from(this.shadowRoot.querySelectorAll('a'))
				.sort((a, b) => { 
					if (a.pathname.length < b.pathname.length) { return 1 }
					if (a.pathname.length == b.pathname.length && a.pathname > b.pathname) { return 1 }
					return -1;
				});

			for (let link of links) {
				if (path.includes(link.pathname)) {
					link.classList.add('active');
					return;
				}
			}
			this
				.shadowRoot
				.querySelector('a[href="/"]')
				.classList
				.add('.active');
		}

		subscribe() {
			PubSub.subscribe(ON_AUTH_CHANGED, this.onAuthenticationChanged);
		}

		onAuthenticationChanged(topic, args) {
			if (args) {

			}
		}
	}
);
