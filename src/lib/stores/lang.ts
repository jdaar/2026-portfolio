import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Language = 'en' | 'es';

const initial: Language = browser
	? ((localStorage.getItem('lang') as Language) || 'es')
	: 'es';

export const lang = writable<Language>(initial);

if (browser) {
	lang.subscribe((v) => {
		localStorage.setItem('lang', v);
		document.documentElement.lang = v;
	});
}
