export function interpolateNumber(start: number, end: number, progress: number): number {
	const p = Math.max(0, Math.min(1, progress));
	return start + (end - start) * p;
}

export function interpolateColor(color1: string, color2: string, factor: number): string {
	const p = Math.max(0, Math.min(1, factor));
	const parseHex = (c: string) => {
		let hex = c.replace('#', '');
		if (hex.length === 3) hex = hex.split('').map((x) => x + x).join('');
		const num = parseInt(hex, 16);
		return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
	};

	try {
		const [r1, g1, b1] = parseHex(color1);
		const [r2, g2, b2] = parseHex(color2);
		const r = Math.round(r1 + p * (r2 - r1));
		const g = Math.round(g1 + p * (g2 - g1));
		const b = Math.round(b1 + p * (b2 - b1));
		return `rgb(${r}, ${g}, ${b})`;
	} catch {
		return color2;
	}
}
