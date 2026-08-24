<script lang="ts">
	import { lang } from '$lib/stores/lang';

	interface TechItem {
		text: string;
		weight: number;
		category: string;
	}

	let {
		words = [],
		filterCategory = '',
		title = ''
	}: {
		words: TechItem[];
		filterCategory?: string;
		title?: string;
	} = $props();

	function getGroupForCategory(rawCat: string): string {
		const c = (rawCat || '').toLowerCase();
		if (c === 'language' || c === 'frontend' || c === 'mobile') return 'frontend';
		if (
			c === 'backend' ||
			c === 'database' ||
			c === 'cloud' ||
			c === 'erp' ||
			c === 'integration' ||
			c === 'cms' ||
			c === 'sync'
		)
			return 'backend';
		if (c === 'ai') return 'ai';
		if (c === 'tooling' || c === 'testing' || c === 'observability') return 'tooling';
		return 'all';
	}

	let userSelectedCategory = $state<string | null>(null);
	let activeCategory = $derived(
		userSelectedCategory ?? (filterCategory ? getGroupForCategory(filterCategory) : 'all')
	);

	const GROUPS = $derived([
		{ id: 'all', label: $lang === 'es' ? 'Todas' : 'All' },
		{ id: 'frontend', label: $lang === 'es' ? 'Lenguajes & Web' : 'Languages & Web' },
		{ id: 'backend', label: $lang === 'es' ? 'Backend & Cloud' : 'Backend & Cloud' },
		{ id: 'ai', label: $lang === 'es' ? 'IA & Datos' : 'AI & Data' },
		{ id: 'tooling', label: $lang === 'es' ? 'Herramientas & Ops' : 'Tooling & Ops' }
	]);

	function getStyle(item: TechItem) {
		const maxWeight = Math.max(...words.map((w) => w.weight), 1);
		const minWeight = Math.min(...words.map((w) => w.weight), 1);
		const norm = (item.weight - minWeight) / (maxWeight - minWeight || 1);
		const fontSize = 10 + norm * 5; // 10px → 15px
		const opacity = 0.72 + norm * 0.28;
		return `font-size: ${fontSize.toFixed(1)}px; color: rgba(245, 242, 236, ${opacity.toFixed(2)});`;
	}
</script>

<div class="card">
	<header class="card-head">
		<h3 class="card-title">
			{title || ($lang === 'es' ? 'Tecnologías & Herramientas' : 'Technologies & Tools')}
		</h3>
		<div class="filters">
			{#each GROUPS as grp}
				<button
					onclick={() => (userSelectedCategory = grp.id)}
					class="chip"
					class:active={activeCategory === grp.id}
				>
					{grp.label}
				</button>
			{/each}
		</div>
	</header>

	<div class="cloud">
		{#each words as item}
			{@const itemGroup = getGroupForCategory(item.category)}
			{@const isMatched = activeCategory === 'all' || itemGroup === activeCategory}
			<span
				style={getStyle(item)}
				class="tag"
				class:muted={!isMatched}
			>
				{item.text}
			</span>
		{/each}
	</div>
</div>

<style>
	.card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		box-sizing: border-box;
	}

	.card-head {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		border: none;
		padding-bottom: 0.2rem;
		width: 100%;
	}

	.card-title {
		margin: 0;
		font-size: 13px;
		font-family: 'Fredoka', sans-serif;
		color: var(--color-ink);
		font-weight: 600;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.chip {
		padding: 0.18rem 0.5rem;
		border-radius: 999px;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 500;
		background: transparent;
		color: var(--color-ink-muted);
		border: 1px solid var(--color-border);
		cursor: pointer;
		transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chip:hover {
		color: var(--color-ink);
		border-color: var(--color-border-strong);
	}

	.chip.active {
		background: var(--color-accent);
		color: var(--color-canvas);
		border-color: var(--color-accent);
	}

	.cloud {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		align-content: center;
		gap: 0.3rem 0.45rem;
		padding: 0.2rem 0;
		flex: 1;
	}

	.tag {
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 500;
		padding: 0.12rem 0.4rem;
		border-radius: 5px;
		border: 1px solid transparent;
		transition: opacity 0.25s ease, transform 0.25s ease, background 0.25s ease,
			border-color 0.25s ease;
		user-select: none;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		vertical-align: middle;
	}

	.tag:not(.muted):hover {
		background: var(--color-surface-2);
		border-color: var(--color-border);
	}

	.tag.muted {
		opacity: 0.2;
		filter: grayscale(0.5);
	}
</style>
