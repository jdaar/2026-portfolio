<script lang="ts">
	import { lang } from '$lib/stores/lang';
	import Logo from '$lib/Logo.svelte';

	interface ContactInfo {
		emails: string[];
		meeting: string;
		linkedin: string;
	}

	let {
		contact = {
			emails: ['jhonatandavid@asprillaarango.com', 'jhonatandaar@gmail.com'],
			meeting: 'meet.asprillaarango.com',
			linkedin: 'linkedin.com/in/jasprilla'
		}
	}: {
		contact?: ContactInfo;
	} = $props();
</script>

<div class="cta">
	<div class="mark">
		<Logo size={72} title="Jhonatan Asprilla" />
	</div>

	<div class="lede">
		<h3 class="title">
			{$lang === 'es'
				? 'Construyamos algo de alto impacto juntos.'
				: "Let's build something high-impact together."}
		</h3>
		<p class="sub">
			{$lang === 'es'
				? 'Disponible para roles de ingeniería de software senior, liderazgo técnico y proyectos de modernización o automatización con IA.'
				: 'Open to senior software engineering roles, technical leadership, and modernization / AI automation projects.'}
		</p>
	</div>

	<div class="actions">
		<a class="action" href="mailto:{contact.emails[0]}">
			<span class="action-label">
				<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<rect x="3" y="5" width="18" height="14" rx="2" />
					<path d="M3 7l9 6 9-6" />
				</svg>
				<span>{$lang === 'es' ? 'Email' : 'Email'}</span>
			</span>
			<span class="action-value">{contact.emails[0]}</span>
		</a>
		<a class="action" href="https://{contact.meeting}" target="_blank" rel="noopener noreferrer">
			<span class="action-label">
				<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<rect x="3" y="5" width="18" height="16" rx="2" />
					<path d="M16 3v4M8 3v4M3 10h18" />
				</svg>
				<span>{$lang === 'es' ? 'Agendar' : 'Book a meeting'}</span>
			</span>
			<span class="action-value">{contact.meeting}</span>
		</a>
		<a class="action" href="https://{contact.linkedin}" target="_blank" rel="noopener noreferrer">
			<span class="action-label">
				<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
				</svg>
				<span>LinkedIn</span>
			</span>
			<span class="action-value">{contact.linkedin}</span>
		</a>
	</div>
</div>

<style>
	.cta {
		max-width: 48rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1.75rem;
		padding: 0;
		background: none;
		border: none;
	}

	.mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--color-ink);
	}

	.lede {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 36rem;
	}

	.title {
		margin: 0;
		font-size: clamp(1.6rem, 3vw, 2.15rem);
		font-weight: 600;
		letter-spacing: -0.015em;
		color: var(--color-ink);
		line-height: 1.2;
	}

	.sub {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: var(--color-ink-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.85rem;
		width: 100%;
		margin-top: 0.5rem;
	}

	.action {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		padding: 0.75rem 1.25rem;
		border-radius: 999px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		color: var(--color-ink);
		text-decoration: none;
		box-shadow: 0 8px 24px -14px rgba(0, 0, 0, 0.5);
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
	}

	.action:hover {
		border-color: var(--color-accent-line);
		background: var(--color-accent-soft);
		transform: translateY(-2px);
		box-shadow: 0 14px 28px -14px rgba(0, 0, 0, 0.55);
	}

	.action-label {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-ink-subtle);
	}

	.icon {
		width: 14px;
		height: 14px;
		flex: none;
		color: var(--color-ink);
		opacity: 0.55;
	}

	.action:hover .icon {
		opacity: 1;
		color: var(--color-accent);
	}

	.action-value {
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		color: var(--color-ink);
		word-break: break-all;
	}
</style>
