<script lang="ts">
	import ScrollSection from './ScrollSection.svelte';
	import SectionHeader from './SectionHeader.svelte';
	import VisualizationSlot from './VisualizationSlot.svelte';
	import { t } from '$lib/utils/t';
	import { lang } from '$lib/stores/lang';

	let { data }: { data: any } = $props();

	const act = $derived(data.narrative?.find((n: any) => n.id === 'consultancy'));
</script>

<ScrollSection id="consultancy">
	{#snippet children()}
		<div class="wrap">
			<SectionHeader
				eyebrow={$lang === 'es' ? '04 · Era de consultoría · Sofka' : '04 · Consultancy era · Sofka'}
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
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}
	.viz-grid > :global(*) {
		width: 100%;
		max-width: 48rem;
	}
</style>
