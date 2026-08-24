<script lang="ts">
	import ScrollSection from './ScrollSection.svelte';
	import SectionHeader from './SectionHeader.svelte';
	import VisualizationSlot from './VisualizationSlot.svelte';
	import { t } from '$lib/utils/t';
	import { lang } from '$lib/stores/lang';

	let { data }: { data: any } = $props();

	const act = $derived(data.narrative?.find((n: any) => n.id === 'origin'));
</script>

<ScrollSection id="origin">
	{#snippet children()}
		<div class="wrap">
			<SectionHeader
				eyebrow=""
				title={t(act?.title, $lang)}
				subtitle={t(act?.subtitle, $lang)}
				body={t(act?.body, $lang)}
			/>

			<div class="viz-stack">
				<!-- Fila 1: Cronología de carrera -->
				<div class="viz-row-full">
					<VisualizationSlot vizId="timelineGantt" {data} />
				</div>

				<p class="section-intro">
					{$lang === 'es'
						? 'Gracias a la experiencia acumulada en banca, seguros, logística y manufactura, cuento con una visión transversal del SDLC y domino un stack robusto de lenguajes, frameworks y patrones arquitectónicos, desde Java reactivo y Spring WebFlux hasta orquestación serverless en AWS y agentes de IA en producción.'
						: 'Thanks to hands-on experience across banking, insurance, logistics, and manufacturing, I bring a cross-cutting SDLC perspective and command a robust stack of languages, frameworks, and architectural patterns, from reactive Java and Spring WebFlux to serverless orchestration on AWS and AI agents running in production.'}
				</p>

				<!-- Fila 2: Distribución por industria + Tecnologías & Herramientas -->
				<div class="viz-row-split">
					<div class="viz-col">
						<VisualizationSlot vizId="donutIndustry" {data} />
					</div>
					<div class="viz-col">
						<VisualizationSlot vizId="wordCloud:technologiesAll" {data} />
					</div>
				</div>

				<p class="section-intro">
					{$lang === 'es'
						? 'El aprendizaje continuo es innegociable: cada hito marcado abajo, de AWS AI Practitioner y Google Cloud a Mambu I/II, Cisco, Red Hat y el Bootcamp Agéntico de la UdeA, es un peldaño deliberado en una carrera que se reinventa al mismo ritmo que evoluciona la industria.'
						: 'Continuous learning is non-negotiable: every milestone below, from AWS AI Practitioner and Google Cloud to Mambu I/II, Cisco, Red Hat, and the UdeA Agentic Bootcamp, is a deliberate step in a career that reinvents itself at the same pace the industry evolves.'}
				</p>

				<!-- Fila 3: Certificaciones & hitos -->
				<div class="viz-row-full">
					<VisualizationSlot vizId="timeline:certifications" {data} />
				</div>
			</div>
		</div>
	{/snippet}
</ScrollSection>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
	}
	.viz-stack {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
	}
	.viz-row-full {
		width: 100%;
	}
	.viz-row-split {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
		align-items: stretch;
	}
	@media (min-width: 900px) {
		.viz-row-split {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
		}
	}
	.viz-col {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.viz-col :global(.slot) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.viz-col :global(.card) {
		height: 100%;
		flex: 1;
		box-sizing: border-box;
	}
	.section-intro {
		margin: 0.5rem 0 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--color-ink-muted);
		max-width: 46rem;
	}
</style>
