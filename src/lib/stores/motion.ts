import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export const reducedMotion = readable(false, (set) => {
	if (!browser) return;
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	set(mq.matches);
	const listener = (e: MediaQueryListEvent) => set(e.matches);
	mq.addEventListener('change', listener);
	return () => mq.removeEventListener('change', listener);
});
