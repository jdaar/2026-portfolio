<script lang="ts">
	let {
		eyebrow = '',
		title = '',
		subtitle = '',
		body = '',
		align = 'left',
		size = 'md'
	}: {
		eyebrow?: string;
		title?: string;
		subtitle?: string;
		body?: string;
		align?: 'left' | 'center';
		size?: 'md' | 'lg';
	} = $props();
</script>

<header class="hdr" data-align={align} data-size={size}>
	{#if eyebrow}
		<span class="eyebrow">
			<span class="eyebrow-dot"></span>
			{eyebrow}
		</span>
	{/if}
	{#if title}
		<h2 class="title">{title}</h2>
	{/if}
	{#if subtitle}
		<p class="subtitle">{subtitle}</p>
	{/if}
	{#if body}
		<p class="body">{body}</p>
	{/if}
</header>

<style>
	.hdr {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		max-width: 46rem;
	}

	.hdr[data-align='center'] {
		align-items: center;
		text-align: center;
		margin: 0 auto;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		letter-spacing: 0.04em;
		text-transform: none;
		color: var(--color-ink-muted);
	}

	.eyebrow-dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--color-accent);
	}

	.title {
		margin: 0;
		font-size: clamp(1.75rem, 3.4vw, 2.5rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.15;
		color: var(--color-ink);
	}

	.hdr[data-size='lg'] .title {
		font-family: var(--font-cursive);
		font-size: clamp(1.5rem, 2.6vw, 2.1rem);
		font-weight: 400;
		letter-spacing: 0;
		line-height: 1.3;
	}

	.subtitle {
		margin: 0;
		font-size: clamp(1rem, 1.6vw, 1.15rem);
		color: var(--color-accent);
		font-weight: 500;
		letter-spacing: -0.005em;
	}

	.body {
		margin: 0;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--color-ink-muted);
	}
</style>
