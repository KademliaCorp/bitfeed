
const supported = {
	en: '/i18n/en.json',
};

export const i18n = new (
	class I18n {
		constructor() {
			const language = this.getLanguage();
			const response = fetch(supported[language]);
			this.language = language;
			this.response = response;
		}
		
		getLanguage() {
			const lang = (navigator.languages ? navigator.languages[0] : navigator.language).toLocaleLowerCase();
			if (lang in supported) { return lang; }
			
			const major = lang.split('-')[0];
			if (major in supported) { return major; }

			return 'en';
		}

		async _(key, params) {
			
			if (!this.translations) {
				const response = await this.response;
				this.translations = await response.json();
			}
			let path = key.split('/');
			let found = this.translations;
			while(path.length && (found = found[path.shift()]));

			if (typeof found === 'strng') { return found; }
			if (typeof found === 'function') { return found(params); }
			return key;
		}
	}
)();
