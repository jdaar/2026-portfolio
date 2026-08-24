<script lang="ts">
	import HookSection from '$lib/scroll/01-Hook.svelte';
	import TimelineSection from '$lib/scroll/02-Timeline.svelte';
	import MasonryDashboardSection from '$lib/scroll/03-MasonryDashboard.svelte';
	import PresentSection from '$lib/scroll/08-Present.svelte';

	let { data } = $props();
</script>

<div class="stack">
	<HookSection {data} />
	<TimelineSection {data} />
	<MasonryDashboardSection {data} />
	<PresentSection {data} />
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
	}
</style>
