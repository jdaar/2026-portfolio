<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { lang } from '$lib/stores/lang';
	import { getChartJS } from '$lib/utils/chartSetup';
	import { theme, chartSeries } from '$lib/utils/theme';
	import { t } from '$lib/utils/t';

	interface IndustryItem {
		industry: string | { en?: string; es?: string };
		engagements: number;
	}

	let { data = [] }: { data: IndustryItem[] } = $props();

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let chartInstance: any;
	let unsubLang: (() => void) | undefined;
	let legendMql: MediaQueryList | undefined;
	let onLegendMqlChange: ((e: MediaQueryListEvent) => void) | undefined;

	const PALETTE = chartSeries;

	function computeLabels(currentLang: 'en' | 'es') {
		return data.map((d) =>
			typeof d.industry === 'object' ? t(d.industry, currentLang) : d.industry
		);
	}

	function refreshLabels(currentLang: 'en' | 'es') {
		if (!chartInstance) return;
		chartInstance.data.labels = computeLabels(currentLang);
		chartInstance.update();
	}

	function applyLegendPosition(isWide: boolean) {
		if (!chartInstance) return;
		chartInstance.options.plugins.legend.position = isWide ? 'right' : 'bottom';
		chartInstance.update();
	}

	onMount(async () => {
		if (!browser || !canvasEl) return;
		const Chart = await getChartJS();
		if (!Chart) return;

		let currentLang: 'en' | 'es' = 'es';
		unsubLang = lang.subscribe((v) => {
			currentLang = v;
			refreshLabels(v);
		});

		legendMql = window.matchMedia('(min-width: 640px)');
		const initialPos: 'right' | 'bottom' = legendMql.matches ? 'right' : 'bottom';

		chartInstance = new Chart(canvasEl, {
			type: 'doughnut',
			data: {
				labels: computeLabels(currentLang),
				datasets: [
					{
						data: data.map((d) => d.engagements),
						backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
						borderColor: 'transparent',
						borderWidth: 0,
						hoverOffset: 6
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: initialPos,
						labels: {
							color: theme.fgMuted,
							boxWidth: 10,
							boxHeight: 10,
							font: { family: "'Fredoka', sans-serif", size: 11, weight: 500 }
						}
					},
					tooltip: {
						backgroundColor: theme.surface,
						titleColor: theme.accent1,
						bodyColor: theme.fg,
						borderColor: theme.borderStrong,
						borderWidth: 1
					}
				},
				cutout: '68%'
			}
		});

		onLegendMqlChange = (e: MediaQueryListEvent) => applyLegendPosition(e.matches);
		legendMql.addEventListener('change', onLegendMqlChange);
	});

	onDestroy(() => {
		unsubLang?.();
		if (legendMql && onLegendMqlChange) legendMql.removeEventListener('change', onLegendMqlChange);
		if (chartInstance) chartInstance.destroy();
	});
</script>

<div class="card">
	<h4 class="card-title">
		{$lang === 'es' ? 'Distribución por industria' : 'Industry distribution'}
	</h4>

	<div class="chart-shell">
		<canvas bind:this={canvasEl}></canvas>
	</div>
</div>

<style>
	.card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		box-sizing: border-box;
	}

	.card-title {
		font-size: 13px;
		font-family: 'Fredoka', sans-serif;
		color: var(--color-ink);
		font-weight: 600;
		margin: 0;
	}

	.chart-shell {
		position: relative;
		width: 100%;
		min-height: 260px;
		height: clamp(260px, 40vw, 320px);
		flex: 1;
	}
</style>
