<script lang="ts">
	import ScrollSection from './ScrollSection.svelte';
	import VisualizationSlot from './VisualizationSlot.svelte';

	let { data }: { data: any } = $props();

	const act = $derived(data.narrative?.find((n: any) => n.id === 'present-cta'));
</script>

<ScrollSection id="present-cta">
	{#snippet children()}
		<div class="wrap">
			{#if act?.visualizations}
				<div class="viz">
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
		width: 100%;
	}
	.viz {
		width: 100%;
	}
</style>
