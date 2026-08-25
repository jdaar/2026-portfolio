<script lang="ts">
	import ScrollSection from './ScrollSection.svelte';
	import SectionHeader from './SectionHeader.svelte';
	import VisualizationSlot from './VisualizationSlot.svelte';
	import Logo from '$lib/Logo.svelte';
	import { t } from '$lib/utils/t';
	import { lang } from '$lib/stores/lang';

	let { data }: { data: any } = $props();

	const act = $derived(data.narrative?.find((n: any) => n.id === 'hook'));
</script>

<ScrollSection id="hook">
	{#snippet children()}
		<div class="hook">
			<div class="top">
				<div class="hero-col">
					<div class="logo-wrap">
						<Logo size={72} title="Jhonatan Asprilla" />
					</div>
					<SectionHeader
						size="lg"
						title={t(act?.title, $lang)}
						subtitle={t(act?.subtitle, $lang)}
						body={t(act?.body, $lang)}
					/>
				</div>
				<div class="globe-col">
					<VisualizationSlot vizId="geoMap" {data} />
				</div>
			</div>

			<div class="cards-row">
				<VisualizationSlot vizId="counters:hero" {data} />
			</div>
		</div>
	{/snippet}
</ScrollSection>

<style>
	:global(#hook.section-shell) {
		box-sizing: border-box;
		padding-top: clamp(2rem, 4vh, 3.5rem);
		padding-bottom: clamp(2rem, 4vh, 3.5rem);
		min-height: 100vh;
	}

	@media (min-width: 900px) {
		:global(#hook.section-shell) {
			height: 100vh;
			min-height: unset;
		}
	}

	:global(#hook .section-inner) {
		min-height: 100%;
		display: flex;
		align-items: center;
	}

	.hook {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
	}

	.top {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		align-items: stretch;
	}

	@media (min-width: 900px) {
		.top {
			grid-template-columns: 1fr 1fr;
			gap: 3rem;
		}
	}

	.hero-col {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
	}

	.logo-wrap {
		color: var(--color-ink);
		display: inline-flex;
	}

	.globe-col {
		position: relative;
		width: 100%;
		min-width: 0;
		align-self: stretch;
		height: clamp(280px, 55vw, 420px);
	}

	@media (min-width: 900px) {
		.globe-col {
			height: auto;
			min-height: 380px;
		}

		.globe-col :global(.slot) {
			position: absolute;
			inset: 0;
		}
	}

	.globe-col :global(.slot) {
		width: 100%;
		height: 100%;
	}

	.cards-row {
		width: 100%;
	}
</style>
