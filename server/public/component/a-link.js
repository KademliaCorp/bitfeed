

export const NAVIGATION_REQUESTED = '@a-link/navigation-requested';
export const NAVIGATION_FETCHING = '@a-link//navigation-fetching';

export const GlobalEvents = new (
	class ALinkEventEmitter extends EventTarget {
		
		constructor() {
			super();
			this.addEventListener(NAVIGATION_REQUESTED, (e) => this.onNavigationRequested(e));
		}
		
		EventNames = {
			NAVIGATION_REQUESTED,
			NAVIGATION_FETCHING,
		};
		
		onNavigationRequested(e) { }

		onNavigationFetching() { }
	}
)();

window.customElements.define(
	'a-link',
	class ALink extends HTMLAnchorElement {
		constructor() {
			super();
			this.addEventListener('click', (e) => {
				//e.preventDefault();
				this.GlobalEvents.dispatchEvent(new CustomEvent(NAVIGATION_REQUESTED, { detail: e }));
			});
		}

		GlobalEvents = GlobalEvents;
		static GlobalEvents = GlobalEvents;
	},
	{ extends: 'a' }
);
