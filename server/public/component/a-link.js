

export const NAVIGATION_REQUESTED = '@a-link/navigation-requested';
export const NAVIGATION_FETCHING = '@a-link//navigation-fetching';

export const GlobalEvents = new (
	class ALinkEventEmitter extends EventTarget {
		
		constructor() {
			super();
			this.addEventListener(NAVIGATION_REQUESTED, this.onNavigationRequested);
		}
		
		EventNames = {
			NAVIGATION_REQUESTED,
			NAVIGATION_FETCHING,
		};
		
		onNavigationRequested() {
			
		}

		onNavigationFetching() {
			
		}
	}
)();

window.customElements.define(
	'a-link',
	class ALink extends HTMLAnchorElement {
		constructor() {
			super();
			this.addEventListener('click', (e) => {
				// e.preventDefault();
				this.GlobalEvents.dispatchEvent(new Event(NAVIGATION_REQUESTED, e));
			});
		}

		GlobalEvents = GlobalEvents;
	},
	{ extends: 'a' }
);
