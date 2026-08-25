<script lang="ts">
	import ScrollSection from './ScrollSection.svelte';
	import SectionHeader from './SectionHeader.svelte';
	import VisualizationSlot from './VisualizationSlot.svelte';
	import { lang } from '$lib/stores/lang';

	let { data }: { data: any } = $props();

	const cards = $derived([
		{
			id: 'firplak-hours',
			category: 'foundations',
			company: 'Firplak',
			mainMetric: $lang === 'es' ? '1,560 h/año' : '1,560 h/year',
			metricLabel: $lang === 'es' ? 'Horas al año ahorradas en operaciones' : 'Hours/year saved in operations',
			subMetric: $lang === 'es' ? '30 h/semana de trabajo manual eliminado en cadena de suministro' : '30 h/week manual work eliminated in supply chain'
		},
		{
			id: 'lotrading-speed',
			category: 'signature',
			company: 'L.O. Trading',
			mainMetric: $lang === 'es' ? '3× Más rápido' : '3× Faster',
			metricLabel: $lang === 'es' ? 'Tiempos de respuesta de APIs (de 2-3s a <1s)' : 'API response times (from 2-3s to <1s)',
			subMetric: $lang === 'es' ? 'Optimización reactiva con Spring WebFlux y R2DBC' : 'Reactive optimization with Spring WebFlux & R2DBC',
			vizId: 'slope:apiResponseTime'
		},
		{
			id: 'lotrading-coverage',
			category: 'signature',
			company: 'L.O. Trading',
			mainMetric: $lang === 'es' ? '100% Cobertura' : '100% Coverage',
			metricLabel: $lang === 'es' ? 'Cobertura de pruebas en rutas críticas' : 'Test coverage on critical paths',
			subMetric: $lang === 'es' ? 'Pruebas de integración reactivas en sistema SOFTLOT' : 'Reactive integration testing in SOFTLOT system'
		},
		{
			id: 'lotrading-timeline',
			category: 'signature',
			company: 'L.O. Trading',
			mainMetric: $lang === 'es' ? '−50% Tiempo de entrega' : '−50% Delivery time',
			metricLabel: $lang === 'es' ? 'Entrega en 5 meses sobre un plan proyectado de 10 meses' : 'Delivery in 5 months vs 10-month plan',
			subMetric: $lang === 'es' ? 'Rescate de salida a producción fallida y 80% de reducción en esfuerzo con Copilot' : 'Failed production launch rescue & 80% effort reduction with Copilot',
			vizId: 'slope:projectTimeline'
		},
		{
			id: 'suramx-quotations',
			category: 'signature',
			company: 'SURA México',
			mainMetric: $lang === 'es' ? '100k / mes' : '100k / month',
			metricLabel: $lang === 'es' ? 'Cotizaciones mensuales de vehículos procesadas' : 'Monthly vehicle quotations processed',
			subMetric: $lang === 'es' ? 'Escala a 3.000 vehículos por solicitud de flota' : 'Scales to 3,000 vehicles per fleet request'
		},
		{
			id: 'suramx-throughput',
			category: 'signature',
			company: 'SURA México',
			mainMetric: $lang === 'es' ? '2× Capacidad' : '2× Capacity',
			metricLabel: $lang === 'es' ? 'Duplicación de capacidad de procesamiento' : 'Doubled processing capacity',
			subMetric: $lang === 'es' ? 'Migración de llamadas bloqueantes (30s) a flujo asíncrono' : 'Migration from blocking calls (30s) to async messaging',
			vizId: 'slope:reportGeneration'
		},
		{
			id: 'diners-users',
			category: 'signature',
			company: 'Diners Club',
			mainMetric: $lang === 'es' ? '250k+ Usuarios' : '250k+ Users',
			metricLabel: $lang === 'es' ? 'Tarjetahabientes activos en Blu App 2.0' : 'Active cardholders on Blu App 2.0',
			subMetric: $lang === 'es' ? 'Avances en efectivo y cajeros con cifrado de doble vía RSA/AES y OAuth' : 'Cash advance & ATM features with 2-way RSA/AES encryption & OAuth'
		},
		{
			id: 'diners-ai-stack',
			category: 'signature',
			company: 'Diners Club',
			mainMetric: $lang === 'es' ? '−56% Latencia & −87% Costos' : '−56% Latency & −87% Cost',
			metricLabel: $lang === 'es' ? 'Reducción en tiempo de ejecución por solicitud y costo operativo' : 'Execution time per request & operational cost reduction',
			subMetric: $lang === 'es' ? 'Banca conversacional por WhatsApp: transición de n8n a AWS Step Functions serverless, memoria DynamoDB TTL, Weaviate RAG y enrutamiento inteligente Haiku/Sonnet' : 'WhatsApp conversational banking: transition from n8n to serverless AWS Step Functions, DynamoDB TTL memory, Weaviate RAG & Haiku/Sonnet smart routing'
		},
		{
			id: 'ai-maturity',
			category: 'ai',
			company: 'Sofka AI',
			mainMetric: '+0.87 & +0.15',
			metricLabel: $lang === 'es' ? 'Elevación de madurez IA en desarrolladores' : 'AI maturity gain across engineering teams',
			subMetric: $lang === 'es' ? 'Evaluación con framework MITRE (escala 1.0–5.0): SURA México (de 2.3 a 3.17) y Diners Club (de 3.87 a 4.02)' : 'Assessed via MITRE framework (1.0–5.0 scale): SURA México (from 2.3 to 3.17) & Diners Club (from 3.87 to 4.02)',
			vizId: 'slope:aiMaturityBoth'
		},
		{
			id: 'ai-devs',
			category: 'ai',
			company: 'Sofka AI',
			mainMetric: $lang === 'es' ? '39 Desarrolladores' : '39 Developers',
			metricLabel: $lang === 'es' ? 'Ingenieros capacitados en adopción de IA' : 'Engineers trained in AI adoption',
			subMetric: $lang === 'es' ? 'Capacitación práctica en SURA México (15 desarrolladores) y Diners Club (24 desarrolladores)' : 'Hands-on training at SURA México (15 devs) & Diners Club (24 devs)'
		}
	]);

	const LEFT_IDS = ['firplak-hours', 'lotrading-speed', 'lotrading-coverage', 'suramx-quotations', 'suramx-throughput'];
	const RIGHT_IDS = ['lotrading-timeline', 'diners-users', 'diners-ai-stack', 'ai-maturity', 'ai-devs'];

	type Card = (typeof cards)[number];
	const leftCards = $derived(
		LEFT_IDS.map((id) => cards.find((c) => c.id === id)).filter((c): c is Card => c !== undefined)
	);
	const rightCards = $derived(
		RIGHT_IDS.map((id) => cards.find((c) => c.id === id)).filter((c): c is Card => c !== undefined)
	);
</script>

<ScrollSection id="dashboard">
	{#snippet children()}
		<div class="wrap">
			<SectionHeader
				eyebrow=""
				title={$lang === 'es' ? 'Talento de ingeniería con impacto real' : 'Engineering talent with real impact'}
				subtitle={$lang === 'es' ? 'Resultados cuantitativos y medibles en automatización, escala, arquitectura reactiva y soluciones de IA.' : 'Quantitative and measurable results in automation, scale, reactive architecture, and AI solutions.'}
			/>

			<!-- Pure Metric Cards Grid -->
			<div class="masonry-grid">
				<div class="masonry-col">
					{#each leftCards as card (card.id)}
						<article class="metric-card">
							<div class="hero-stat-block">
								<span class="stat-number">{card.mainMetric}</span>
								<span class="stat-label">{card.metricLabel}</span>
								{#if card.subMetric}
									<span class="stat-sub">{card.subMetric}</span>
								{/if}
							</div>
							<div class="card-footer-meta">
								<span class="tag company-tag">{card.company}</span>
							</div>
							{#if card.vizId}
								<div class="card-viz-container">
									<VisualizationSlot vizId={card.vizId} {data} />
								</div>
							{/if}
						</article>
					{/each}
				</div>
				<div class="masonry-col">
					{#each rightCards as card (card.id)}
						<article class="metric-card">
							<div class="hero-stat-block">
								<span class="stat-number">{card.mainMetric}</span>
								<span class="stat-label">{card.metricLabel}</span>
								{#if card.subMetric}
									<span class="stat-sub">{card.subMetric}</span>
								{/if}
							</div>
							<div class="card-footer-meta">
								<span class="tag company-tag">{card.company}</span>
							</div>
							{#if card.vizId}
								<div class="card-viz-container">
									<VisualizationSlot vizId={card.vizId} {data} />
								</div>
							{/if}
						</article>
					{/each}
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

	.masonry-grid {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
	}

	.masonry-col {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		min-width: 0;
	}

	@media (min-width: 900px) {
		.masonry-grid {
			flex-direction: row;
			align-items: flex-start;
		}
		.masonry-col {
			flex: 1;
		}
	}

	.metric-card {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		width: 100%;
		box-sizing: border-box;
		background: color-mix(in srgb, var(--color-surface) 96%, transparent);
		border: 1px solid var(--color-border);
		border-radius: 14px;
		padding: 1.15rem;
		transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
	}

	.metric-card:hover {
		transform: translateY(-3px);
		border-color: var(--color-accent);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.hero-stat-block {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin: 0;
	}

	.stat-number {
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 2.1rem;
		font-weight: 700;
		color: var(--color-accent);
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.stat-label {
		font-size: 13.5px;
		font-weight: 600;
		color: var(--color-ink);
		line-height: 1.35;
	}

	.stat-sub {
		font-size: 11.5px;
		color: var(--color-ink-muted);
		line-height: 1.4;
	}

	.card-footer-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
	}

	.tag {
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		padding: 0.18rem 0.45rem;
		border-radius: 5px;
		background: color-mix(in srgb, var(--color-ink-subtle) 10%, transparent);
		color: var(--color-ink-muted);
		border: 1px solid var(--color-border);
	}

	.tag.company-tag {
		background: var(--color-accent-soft);
		color: var(--color-accent);
		border-color: var(--color-accent-line);
		font-weight: 700;
	}

	/* Eliminate inner nested card wrappers & line separators */
	.card-viz-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0;
		border: none;
	}

	.card-viz-container :global(.card) {
		background: transparent !important;
		border: none !important;
		border-radius: 0 !important;
		padding: 0 !important;
		box-shadow: none !important;
		margin: 0 !important;
	}

	.card-viz-container :global(.card-head) {
		display: flex !important;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.4rem;
		min-width: 0;
		width: 100%;
	}

	.card-viz-container :global(.card-title) {
		display: block !important;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 600;
		text-transform: none !important;
		letter-spacing: 0.03em;
		color: var(--color-ink-muted);
		margin: 0;
		white-space: nowrap !important;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		flex: 1;
		min-width: 0;
	}

	.card-viz-container :global(.delta-pill) {
		white-space: nowrap !important;
		flex-shrink: 0 !important;
	}
</style>
