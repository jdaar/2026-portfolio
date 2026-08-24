<script lang="ts">
	import ScrollSection from './ScrollSection.svelte';
	import SectionHeader from './SectionHeader.svelte';
	import VisualizationSlot from './VisualizationSlot.svelte';
	import { t } from '$lib/utils/t';
	import { lang } from '$lib/stores/lang';

	let { data }: { data: any } = $props();

	const act = $derived(data.narrative?.find((n: any) => n.id === 'signature-suramx'));
</script>

<ScrollSection id="signature-suramx">
	{#snippet children()}
		<div class="wrap">
			<SectionHeader
				eyebrow={$lang === 'es' ? '06 · Caso · SURA México' : '06 · Signature · SURA México'}
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
			grid-template-columns: repeat(3, minmax(0, 1fr));
			align-items: stretch;
		}
	}
</style>
