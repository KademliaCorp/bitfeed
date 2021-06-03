import { i18n } from '/service/i18n.js'

export const EVENT_PREFIX = '@sign-in';

export const STATE_AWAITING_USER = 'awaiting-user';
export const STATE_TUMBLING = 'tumbling';
export const STATE_SIGNING_IN = 'signing-in';
export const STATE_FAILED = 'failed';
export const STATE_SUCCESS = 'success';

export const IN_TRANSIT_STATES = [ STATE_TUMBLING, STATE_SIGNING_IN ];
export const AT_REST_STATES = [	STATE_AWAITING_USER, STATE_FAILED, STATE_SUCCESS ];

export const AWAITING_USER = `${EVENT_PREFIX}/${STATE_AWAITING_USER}`;
export const SIGNING_TUMBLING = `${EVENT_PREFIX}/${STATE_TUMBLING}`;
export const SIGNING_IN = `${EVENT_PREFIX}/${STATE_SIGNING_IN}`;
export const SIGN_IN_FAILED = `${EVENT_PREFIX}/${STATE_FAILED}`;
export const SIGN_IN_SUCCESS = `${EVENT_PREFIX}/${STATE_SUCCESS}`;

export const GlobalEvents = new (
	class SignInEventEmitter extends EventTarget {
		EventNames = {
			AWAITING_USER,
			SIGNING_TUMBLING,
			SIGNING_IN,
			SIGN_IN_FAILED,
			SIGN_IN_SUCCESS,
		};
	}
)();

(async () => {
	// const window = {};
	const response = await fetch('/js/hashes.min.js');
	const script = await response.text();
	eval.call(window, script);

	const Hashes = window.Hashes;
	const MD5 = Hashes.MD5;
	const SHA1 = Hashes.SHA1;
	const SHA256 = Hashes.SHA256;
	const SHA512 = Hashes.SHA512;
	const RMD160 = Hashes.RMD160;
	
	const hashes = {
		MD5: new MD5(),
		SHA1: new SHA1(),
		SHA256: new SHA256(),
		SHA512: new SHA512(),
		RMD160: new RMD160(),
	};
	
	async function tumble(username, password, salt, difficulty) {
		username = username.toLowerCase();
		
		// prng sort our hashes
		const hashers = Object
			.entries(hashes)
			.map(entry => [Hashes.CRC32(`${entry[0]}:${salt}:${username}:${password}`), entry[1]])
			.sort((a, b) => a[0] - b[0])
			.map(entry => entry[1]);
	
		let tumbled = hashers[0].b64(`${salt}:${username}:${password}`);
		return await new Promise((res, rej) => {
			setTimeout(() => {
				for (let index = 0; index < (difficulty * 2); index++) {
					const hasher = hashers[index % hashers.length];
					tumbled = hasher.b64(`${salt}:${username}:${password}:${tumbled}`);
					if (!(Hashes.CRC32(tumbled) % difficulty)) { break; }
				}
	
				return res(tumbled);
			}, 100);
		});
	}

	const css = /* css */ `
		* { box-sizing: border-box; }
		:host {
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			transition : filter 100ms linear;
		}

		:host([hidden]) { display: none }

		:host([state="${STATE_TUMBLING}"]) .user-input, :host([state="${STATE_SIGNING_IN}"]) .user-input  {
			filter: blur(0.2em);
			pointer-events: none;
			user-select: none;
		}

		:host([state="${STATE_TUMBLING}"]) loader-box, :host([state="${STATE_SIGNING_IN}"]) loader-box  {
			display: block;
		}
		
		:host([state="${STATE_FAILED}"]) {
			animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
			transform: translate3d(0, 0, 0);
			backface-visibility: hidden;
			perspective: 1000px;
		}
		
		input-field {
			width: 100%;
			margin-bottom: 1em;
		}

		.user-input {
		}

		loader-box {
			display: none;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}

		@media screen and (max-width: 20em) {
			input-field {
				width: 100%;
			}
		}
	`;


	const template = document.createElement('template');
	template.innerHTML = /* html */ `
		<style>${css}</style>
		<section class="user-input">
			<input-field id="username" label="username" type="text" title="username" placeholder="username" autofocus></input-field>
			<input-field id="password" label="password" type="text" title="password" placeholder="password"></input-field>
			<button type="submit">Login</button>
			<a class="forgot" href="#">Forgot Username?</a>
		</section>
		<section class="notification">

		</section>
		<loader-box></loader-box>
	`;

	window.customElements.define(
		'sign-in',
		class SignIn extends HTMLElement {
			constructor() {
				super();
				const shadowRoot = this.attachShadow({ mode: 'open' });
				shadowRoot.appendChild(template.content.cloneNode(true));
				this._addEventListeners();
			}

			GlobalEvents = GlobalEvents;

			get difficulty() {
				return this.getAttribute('difficulty');
			}

			get salt() {
				return this.getAttribute('salt');
			}

			get submitTo() {
				return this.getAttribute('submit-to');
			}

			get state() {
				return this.getAttribute('state');
			}

			set state(value) {
				this.setAttribute('state', value);
			}

			// coup d'é·tat
			_removeFailedState() {
				if (this.state == STATE_FAILED) {
					this.state = STATE_AWAITING_USER;
				}
				this
					.shadowRoot
					.querySelectorAll('input-field')
					.forEach(field => field.setAttribute('state', null));
			};

			async _setFailedState(message) {
				console.log('MESSAGE: ', message);
				this.state = STATE_FAILED;
				this
					.shadowRoot
					.querySelectorAll('input-field')
					.forEach(field => field.setAttribute('state', 'invalid'));
				this.dispatchEvent(new CustomEvent(SIGN_IN_FAILED, { message: await i18n._(message || 'auth/invalid') }));
			}

			_syncAttributes() {

			}

			_addEventListeners() {
				// remove failed state when a button or input-field is clicked or receives input
				this
					.shadowRoot
					.querySelectorAll('input-field, button')
					.forEach(element => ['input', 'click'].map(event => element.addEventListener(event, () => this._removeFailedState())));

				// on login clicked
				this
					.shadowRoot
					.querySelector('button')
					.addEventListener('click', async (e) => {
						if (IN_TRANSIT_STATES.includes(this.state)) { return; }

						const username = this
							.shadowRoot
							.querySelector('#username')
							.value;

						const password = this
							.shadowRoot
							.querySelector('#password')
							.value;

						
						if (!username || !password) { return this._setFailedState(); }

						const salt = this.salt;
						const difficulty = this.difficulty;

						this.state = STATE_TUMBLING;
						console.time('Tumbling');
						const tumbled = await tumble(username, password, salt, difficulty);
						console.log(tumbled);
						console.timeEnd('Tumbling');

						this.state = STATE_SIGNING_IN;
						try {
							const response = await fetch(this.submitTo, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ username, password: tumbled, salt, difficulty })
							});
							const result = await response.json();
							if (result.loggedIn) {
								this.state = STATE_SUCCESS;
							} else {
								this._setFailedState();
							}
						} catch (error) {
							this._setFailedState();
						}
					});
			}
		}
	);
})()

