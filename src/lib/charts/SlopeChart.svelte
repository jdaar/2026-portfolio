<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { lang } from '$lib/stores/lang';
	import { getChartJS } from '$lib/utils/chartSetup';
	import { theme } from '$lib/utils/theme';
	import { t } from '$lib/utils/t';

	interface SlopeData {
		context: string | { en?: string; es?: string };
		before: number;
		after: number;
		unit?: string | { en?: string; es?: string };
		scale?: number;
		improvementX?: number;
		reductionPercent?: number;
		throughputMultiplierX?: number;
		delta?: number;
	}

	let {
		data
	}: {
		data: SlopeData;
		progress?: number;
		color?: string;
	} = $props();

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let chartInstance: any;

	const contextText = $derived(typeof data.context === 'object' ? t(data.context, $lang) : data.context);
	const unitText = $derived(typeof data.unit === 'object' ? t(data.unit, $lang) : (data.unit || ''));

	const deltaText = $derived.by(() => {
		if (data.improvementX) return $lang === 'es' ? `${data.improvementX}× más rápido` : `${data.improvementX}× faster`;
		if (data.reductionPercent) return `−${data.reductionPercent}%`;
		if (data.throughputMultiplierX) return $lang === 'es' ? `${data.throughputMultiplierX}× capacidad` : `${data.throughputMultiplierX}× throughput`;
		if (data.delta) return `+${data.delta}`;
		const diff = Number((data.after - data.before).toFixed(2));
		return diff > 0 ? `+${diff}` : `${diff}`;
	});

	const ACCENT = theme.accent1;
	const INK = theme.fg;
	const MUTED = theme.fgSubtle;
	const GRID = theme.gridLine;

	onMount(async () => {
		if (!browser || !canvasEl) return;
		const Chart = await getChartJS();
		if (!Chart) return;

		chartInstance = new Chart(canvasEl, {
			type: 'line',
			data: {
				labels: [$lang === 'es' ? 'Antes' : 'Before', $lang === 'es' ? 'Después' : 'After'],
				datasets: [
					{
						label: contextText,
						data: [data.before, data.after],
						borderColor: ACCENT,
						borderWidth: 2,
						backgroundColor: theme.accent1Soft,
						fill: true,
						tension: 0,
						pointRadius: 5,
						pointHoverRadius: 7,
						pointBackgroundColor: INK,
						pointBorderColor: ACCENT,
						pointBorderWidth: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						grid: { color: GRID },
						ticks: {
							color: MUTED,
							font: { family: "'Fredoka', ui-monospace, monospace", size: 10.5, weight: 500 },
							callback: (val: any) => `${val}${unitText}`
						}
					},
					x: {
						grid: { color: GRID },
						ticks: {
							color: INK,
							font: { family: "'Fredoka', sans-serif", size: 12, weight: 'bold' }
						}
					}
				},
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: theme.surface,
						titleColor: ACCENT,
						bodyColor: INK,
						borderColor: theme.borderStrong,
						borderWidth: 1,
						callbacks: {
							label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw}${unitText}`
						}
					}
				}
			}
		});
	});

	$effect(() => {
		if (chartInstance) {
			chartInstance.data.labels = [$lang === 'es' ? 'Antes' : 'Before', $lang === 'es' ? 'Después' : 'After'];
			chartInstance.data.datasets[0].label = contextText;
			chartInstance.options.scales.y.ticks.callback = (val: any) => `${val}${unitText}`;
			chartInstance.update();
		}
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
	});
</script>

<div class="card">
	<header class="card-head">
		<h4 class="card-title">{contextText}</h4>
		<span class="delta-pill">{deltaText}</span>
	</header>
	<div class="chart-shell">
		<canvas bind:this={canvasEl}></canvas>
	</div>
</div>

<style>
	.card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.15rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		min-width: 0;
		width: 100%;
	}

	.card-title {
		font-size: 12px;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		letter-spacing: 0.02em;
		text-transform: none;
		color: var(--color-ink);
		margin: 0;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
		min-width: 0;
	}

	.delta-pill {
		padding: 0.18rem 0.5rem;
		border-radius: 999px;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-accent);
		background: var(--color-accent-soft);
		border: 1px solid var(--color-accent-line);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.chart-shell {
		position: relative;
		width: 100%;
		height: 180px;
	}
</style>
