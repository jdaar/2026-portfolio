import type { Language } from '$lib/stores/lang';

export function formatNumber(
	val: number,
	formatHint?: string,
	currentLang: Language = 'en'
): string {
	const locale = currentLang === 'es' ? 'es-CO' : 'en-US';

	switch (formatHint) {
		case 'compact': {
			const formatted = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(val);
			return formatted.replace(/\s*k/gi, 'k');
		}
		case 'integer':
			return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(val);
		case 'percent':
			return `${Math.round(val)}%`;
		case 'percent-decimal':
			return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)}%`;
		case 'decimal':
			return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
		case 'multiplier':
			return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(val)}×`;
		default:
			return new Intl.NumberFormat(locale).format(val);
	}
}
