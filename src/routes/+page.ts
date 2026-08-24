import data from '$lib/assets/data.json';

export const prerender = true;

export function load() {
	return data;
}
