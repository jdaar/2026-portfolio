import { get } from 'svelte/store';
import { lang, type Language } from '$lib/stores/lang';

export function t(obj: { en?: string; es?: string } | undefined | null, currentLang?: Language): string {
	if (!obj) return '';
	const selectedLang = currentLang ?? get(lang);
	return obj[selectedLang] || obj['en'] || obj['es'] || '';
}
