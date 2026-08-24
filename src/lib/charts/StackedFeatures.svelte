<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { lang } from '$lib/stores/lang';
	import { getChartJS } from '$lib/utils/chartSetup';
	import { theme } from '$lib/utils/theme';

	interface ProjectItem {
		id: string;
		name: string;
		experienceId?: string;
		featureCategories: Record<string, number>;
	}

	let {
		projects = [],
		title = ''
	}: {
		projects: ProjectItem[];
		title?: string;
	} = $props();

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let chartInstance: any;

	const CATEGORY_PALETTE: Record<string, string> = {
		automation: theme.accent1,
		integration: theme.accent2,
		performance: '#c5da7f',
		ux: '#4aa1d8',
		security: '#8a9b3f',
		analytics: '#155f8f',
		ai: '#b7d76b'
	};

	onMount(async () => {
		if (!browser || !canvasEl) return;
		const Chart = await getChartJS();
		if (!Chart) return;

		const categories = Array.from(
			new Set(projects.flatMap((p) => Object.keys(p.featureCategories || {})))
		);

		const datasets = categories.map((cat) => ({
			label: cat,
			data: projects.map((p) => p.featureCategories[cat] || 0),
			backgroundColor: CATEGORY_PALETTE[cat] || theme.borderStrong,
			borderRadius: 3,
			borderWidth: 0
		}));

		chartInstance = new Chart(canvasEl, {
			type: 'bar',
			data: {
				labels: projects.map((p) => p.name),
				datasets
			},
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						stacked: true,
						grid: { color: theme.gridLine },
						ticks: { color: theme.fgSubtle, font: { family: "'Fredoka', sans-serif", size: 10.5 } }
					},
					y: {
						stacked: true,
						grid: { display: false },
						ticks: { color: theme.fg, font: { family: "'Fredoka', sans-serif", size: 11.5, weight: 'bold' } }
					}
				},
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							color: theme.fgMuted,
							boxWidth: 10,
							boxHeight: 10,
							font: { family: "'Fredoka', sans-serif", size: 11 }
						}
					},
					tooltip: {
						backgroundColor: theme.surface,
						titleColor: theme.accent1,
						bodyColor: theme.fg,
						borderColor: theme.borderStrong,
						borderWidth: 1
					}
				}
			}
		});
	});

	onDestroy(() => {
		if (chartInstance) chartInstance.destroy();
	});
</script>

<div class="card">
	<h4 class="card-title">
		{title || ($lang === 'es' ? 'Capacidades entregadas' : 'Delivered capabilities')}
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
	}

	.card-title {
		margin: 0;
		font-size: 12px;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
		font-weight: 600;
	}

	.chart-shell {
		position: relative;
		width: 100%;
		height: 260px;
	}
</style>
