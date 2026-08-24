export const theme = {
	// Base palette
	fg: '#f2e8cf',
	accent1: '#a7c957',
	accent2: '#1982c4',
	bg: '#100c12',
	border: '#2e2d31',

	// Derived
	fgMuted: 'rgba(242, 232, 207, 0.7)',
	fgSubtle: 'rgba(242, 232, 207, 0.45)',
	surface: '#171319',
	surface2: '#1e1a20',
	borderStrong: '#3d3b42',
	accent1Soft: 'rgba(167, 201, 87, 0.14)',
	accent1Line: 'rgba(167, 201, 87, 0.4)',
	accent2Soft: 'rgba(25, 130, 196, 0.14)',
	accent2Line: 'rgba(25, 130, 196, 0.4)',
	gridLine: 'rgba(242, 232, 207, 0.06)'
} as const;

export const chartSeries = [
	theme.accent1,
	theme.accent2,
	'#c5da7f',
	'#4aa1d8',
	'#6b6a71'
] as const;
