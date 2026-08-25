<script lang="ts">
	import AnimatedCounter from '$lib/charts/AnimatedCounter.svelte';
	import TimelineGantt from '$lib/charts/TimelineGantt.svelte';
	import SlopeChart from '$lib/charts/SlopeChart.svelte';
	import WordCloud from '$lib/charts/WordCloud.svelte';
	import DonutIndustry from '$lib/charts/DonutIndustry.svelte';
	import StackedFeatures from '$lib/charts/StackedFeatures.svelte';
	import GeoMap from '$lib/charts/GeoMap.svelte';
	import ContactCard from '$lib/charts/ContactCard.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { reducedMotion } from '$lib/stores/motion';
	import { lang } from '$lib/stores/lang';
	import { t } from '$lib/utils/t';

	let {
		vizId = '',
		data = {}
	}: {
		vizId: string;
		data: any;
	} = $props();

	let slot: HTMLElement | undefined = $state();
	let progress = $state(0);

	onMount(() => {
		if (!browser || !slot) return;

		if ($reducedMotion) {
			progress = 1;
			return;
		}

		let trigger: any;
		let disposed = false;

		(async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);
			if (disposed || !slot) return;

			trigger = ScrollTrigger.create({
				trigger: slot,
				start: 'top 75%',
				end: 'center center',
				scrub: true,
				onUpdate: (self) => {
					progress = self.progress;
				}
			});
		})();

		return () => {
			disposed = true;
			trigger?.kill();
		};
	});
</script>

<div class="slot" bind:this={slot}>
	{#if vizId === 'counters:hero'}
		<div class="counters-grid">
			{#if data.highlights}
				{#each data.highlights.slice(0, 4) as h}
					<AnimatedCounter
						numericValue={h.numericValue}
						displayValue={h.displayValue || h.value}
						unit={typeof h.unit === 'object' ? t(h.unit, $lang) : h.unit}
						formatHint={h.formatHint}
						prefix={h.prefix || ''}
						suffix={h.suffix || ''}
						label={typeof h.title === 'object' ? t(h.title, $lang) : h.title}
						{progress}
					/>
				{/each}
			{/if}
		</div>
	{:else if vizId === 'counter:hoursSaved'}
		<div class="single">
			<AnimatedCounter
				numericValue={1560}
				displayValue="1,560"
				prefix="≈"
				unit={$lang === 'es' ? 'h/año' : 'h/year'}
				formatHint="integer"
				label={$lang === 'es' ? 'Operaciones manuales ahorradas en cadena de suministro en Firplak' : 'Manual supply-chain operations saved at Firplak'}
				{progress}
			/>
		</div>
	{:else if vizId === 'counter:effortReduction'}
		<div class="single">
			<AnimatedCounter
				numericValue={80}
				displayValue="80%"
				unit={$lang === 'es' ? 'reducción' : 'reduction'}
				formatHint="percent"
				label={$lang === 'es' ? 'Esfuerzo de pruebas y migración legacy reducido con herramientas de IA' : 'Testing & legacy migration effort reduced with AI tooling'}
				{progress}
			/>
		</div>
	{:else if vizId === 'counter:quotationsPerMonth'}
		<div class="single">
			<AnimatedCounter
				numericValue={100000}
				displayValue="100k"
				unit={$lang === 'es' ? 'cotizaciones/mes' : 'quotations/month'}
				formatHint="compact"
				label={$lang === 'es' ? 'Cotizaciones mensuales de vehículos procesadas de forma asíncrona en SURA México' : 'Monthly vehicle quotations handled asynchronously at SURA México'}
				{progress}
			/>
		</div>
	{:else if vizId === 'counter:usersServed'}
		<div class="single">
			<AnimatedCounter
				numericValue={250000}
				displayValue="250k+"
				suffix="+"
				unit={$lang === 'es' ? 'usuarios' : 'users'}
				formatHint="compact"
				color="accent1"
				label={$lang === 'es' ? 'Tarjetahabientes activos atendidos en Blu App 2.0 (Diners Club)' : 'Active cardholders served on Blu App 2.0 (Diners Club)'}
				{progress}
			/>
		</div>
	{:else if vizId === 'timelineGantt'}
		<TimelineGantt
			work={data.timeline?.work}
			education={data.timeline?.education}
			certifications={data.timeline?.certifications}
			{progress}
			mode="full"
		/>
	{:else if vizId === 'timeline:certifications'}
		<TimelineGantt certifications={data.timeline?.certifications} {progress} mode="certs" />
	{:else if vizId === 'slope:apiResponseTime'}
		{#if data.chartData?.beforeAfter?.apiResponseTimeSec}
			<SlopeChart data={data.chartData.beforeAfter.apiResponseTimeSec} {progress} />
		{/if}
	{:else if vizId === 'slope:projectTimeline'}
		{#if data.chartData?.beforeAfter?.projectTimelineMonths}
			<SlopeChart data={data.chartData.beforeAfter.projectTimelineMonths} {progress} />
		{/if}
	{:else if vizId === 'slope:reportGeneration'}
		{#if data.chartData?.beforeAfter?.reportGenerationSec}
			<SlopeChart data={data.chartData.beforeAfter.reportGenerationSec} {progress} />
		{/if}
	{:else if vizId === 'slope:aiMaturitySuramx'}
		{#if data.chartData?.beforeAfter?.aiMaturitySuramx}
			<SlopeChart data={data.chartData.beforeAfter.aiMaturitySuramx} {progress} />
		{/if}
	{:else if vizId === 'slope:aiMaturityDiners'}
		{#if data.chartData?.beforeAfter?.aiMaturityDiners}
			<SlopeChart data={data.chartData.beforeAfter.aiMaturityDiners} {progress} />
		{/if}
	{:else if vizId === 'slope:aiMaturityBoth'}
		<div class="pair">
			{#if data.chartData?.beforeAfter?.aiMaturitySuramx}
				<SlopeChart data={data.chartData.beforeAfter.aiMaturitySuramx} {progress} />
			{/if}
			{#if data.chartData?.beforeAfter?.aiMaturityDiners}
				<SlopeChart data={data.chartData.beforeAfter.aiMaturityDiners} {progress} />
			{/if}
		</div>
	{:else if vizId === 'wordCloud:technologiesAll'}
		<WordCloud words={data.keywordClouds?.technologies || []} />
	{:else if vizId === 'wordCloud:bankingStack'}
		<WordCloud
			words={(data.keywordClouds?.technologies || []).filter((w: any) =>
				['language', 'backend', 'mobile', 'security', 'ai', 'cloud'].includes(w.category)
			)}
			title={$lang === 'es' ? 'Stack bancario y empresarial' : 'Banking & enterprise stack'}
		/>
	{:else if vizId === 'donutIndustry'}
		<DonutIndustry data={data.chartData?.industryMix || []} />
	{:else if vizId === 'stackedFeatures:firplakProjects'}
		<StackedFeatures
			projects={(data.projects || []).filter((p: any) => p.experienceId === 'firplak')}
			title={$lang === 'es' ? 'Automatizaciones de cadena de suministro Firplak' : 'Firplak supply-chain automations'}
		/>
	{:else if vizId === 'stackedFeatures:aiProjects'}
		<StackedFeatures
			projects={(data.projects || []).filter((p: any) =>
				['skai', 'iris', 'bot', 'operational_commercial_dashboard'].includes(p.id)
			)}
			title={$lang === 'es' ? 'Plataforma IA y capacidades de agentes' : 'AI platform & agent capabilities'}
		/>
	{:else if vizId === 'geoMap'}
		<GeoMap experiences={data.experiences || []} />
	{:else if vizId === 'contactCard'}
		<ContactCard contact={data.profile?.contact} />
	{/if}
</div>

<style>
	.slot {
		width: 100%;
		container-type: inline-size;
	}
	.counters-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.9rem;
	}
	@media (min-width: 640px) {
		.counters-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 1024px) {
		.counters-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	.single {
		max-width: 28rem;
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}
	@container (min-width: 460px) {
		.pair {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.75rem;
		}
	}
	.pair :global(.card) {
		min-width: 0;
	}
	.pair :global(.chart-shell) {
		height: 150px;
	}
</style>
