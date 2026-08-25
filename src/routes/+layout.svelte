<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { lang } from '$lib/stores/lang';

	let { children } = $props();

	function toggleLang() {
		lang.update((l) => (l === 'es' ? 'en' : 'es'));
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Jhonatan Asprilla, Senior Software Engineer</title>
	<meta
		name="description"
		content="Portfolio of Jhonatan David Asprilla Arango, Senior Software Engineer specializing in reactive backends, mobile, and applied AI."
	/>
</svelte:head>

<div class="site">
	<div class="top-actions">
		<a
			class="templ8r-cta"
			href="https://templ8r.co"
			target="_blank"
			rel="noopener noreferrer"
		>
			{$lang === 'es' ? 'Ir a templ8r.co' : 'Go to templ8r.co'}
		</a>
		<button onclick={toggleLang} aria-label="Toggle language" class="lang-toggle">
			<span class:active={$lang === 'en'}>EN</span>
			<span class="divider">/</span>
			<span class:active={$lang === 'es'}>ES</span>
		</button>
	</div>

	<main class="site-main">
		{@render children()}
	</main>

	<footer class="site-footer">
		<p>© {new Date().getFullYear()} Jhonatan David Asprilla Arango</p>
	</footer>
</div>

<style>
	.site {
		position: relative;
		min-height: 100vh;
		background: var(--color-canvas);
		color: var(--color-ink);
	}

	.top-actions {
		position: fixed;
		top: 1.1rem;
		right: 1.1rem;
		z-index: 50;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.templ8r-cta,
	.lang-toggle {
		box-sizing: border-box;
		height: 32px;
		display: inline-flex;
		align-items: center;
		padding: 0 0.85rem;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 600;
		line-height: 1;
		border-radius: 999px;
		border: 1px solid transparent;
	}

	.templ8r-cta {
		color: #111;
		background: #ffffff;
		border-color: #ffffff;
		text-decoration: none;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
		transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
	}

	.templ8r-cta:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
		background: #f4f4f4;
	}

	.lang-toggle {
		gap: 0.35rem;
		padding: 0 0.75rem;
		color: var(--color-ink-muted);
		background: color-mix(in srgb, var(--color-canvas) 82%, transparent);
		backdrop-filter: saturate(140%) blur(8px);
		-webkit-backdrop-filter: saturate(140%) blur(8px);
		border-color: var(--color-border);
		cursor: pointer;
		transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
	}

	.lang-toggle:hover {
		border-color: var(--color-border-strong);
		color: var(--color-ink);
	}

	.lang-toggle .divider {
		color: var(--color-ink-subtle);
	}

	.lang-toggle .active {
		color: var(--color-accent);
	}

	.site-main {
		position: relative;
		z-index: 1;
	}

	.site-footer {
		padding: 2.5rem 1.5rem;
		text-align: center;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		color: var(--color-ink-subtle);
		border-top: 1px solid var(--color-border);
	}
</style>
