<script lang="ts">
	import ScrollSection from './ScrollSection.svelte';
	import SectionHeader from './SectionHeader.svelte';
	import VisualizationSlot from './VisualizationSlot.svelte';
	import { t } from '$lib/utils/t';
	import { lang } from '$lib/stores/lang';

	let { data }: { data: any } = $props();

	const act = $derived(data.narrative?.find((n: any) => n.id === 'ai-thread'));
</script>

<ScrollSection id="ai-thread">
	{#snippet children()}
		<div class="wrap">
			<SectionHeader
				eyebrow={$lang === 'es' ? '08 · Hilo de IA aplicada' : '08 · Applied AI thread'}
				title={t(act?.title, $lang)}
				subtitle={t(act?.subtitle, $lang)}
				body={t(act?.body, $lang)}
			/>

			{#if act?.visualizations}
				<div class="viz-grid">
					{#each act.visualizations as vizId}
						<VisualizationSlot {vizId} {data} />
					{/each}
				</div>
			{/if}
		</div>
	{/snippet}
</ScrollSection>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.viz-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}
	@media (min-width: 900px) {
		.viz-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
