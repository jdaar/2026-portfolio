<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { reducedMotion } from '$lib/stores/motion';

	let {
		id,
		tone = 'neutral',
		children
	}: {
		id?: string;
		tone?: 'neutral' | 'accent';
		children?: Snippet<[]>;
	} = $props();

	let container: HTMLElement | undefined = $state();
	let visible = $state(false);

	onMount(() => {
		if (!browser || !container) return;

		if ($reducedMotion) {
			visible = true;
			return;
		}

		let revealTrigger: any;
		let disposed = false;

		(async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);
			if (disposed || !container) return;

			revealTrigger = ScrollTrigger.create({
				trigger: container,
				start: 'top 85%',
				once: true,
				onEnter: () => {
					visible = true;
				}
			});
		})();

		return () => {
			disposed = true;
			revealTrigger?.kill();
		};
	});
</script>

<section
	{id}
	bind:this={container}
	data-tone={tone}
	class="section-shell section-reveal"
	class:visible
>
	<div class="section-inner">
		{#if children}
			{@render children()}
		{/if}
	</div>
</section>

<style>
	.section-shell {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: clamp(4rem, 8vh, 7rem) clamp(1.25rem, 4vw, 3.5rem);
	}

	.section-inner {
		width: 100%;
		max-width: 72rem;
		margin: 0 auto;
	}

	.section-reveal {
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.7s ease-out, transform 0.7s ease-out;
		will-change: opacity, transform;
	}

	.section-reveal.visible {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.section-reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
