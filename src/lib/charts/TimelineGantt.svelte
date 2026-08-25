<script lang="ts">
	import { lang } from '$lib/stores/lang';
	import { theme } from '$lib/utils/theme';
	import { t } from '$lib/utils/t';

	type LocalizedLabel = string | { en?: string; es?: string };

	interface WorkItem {
		id?: string;
		type: string;
		label: LocalizedLabel;
		start: string;
		end: string | null;
		parent?: string;
	}

	interface EduItem {
		type: string;
		label: LocalizedLabel;
		start: string;
		end: string | null;
	}

	interface CertItem {
		type: string;
		label: LocalizedLabel;
		date: string;
	}

	function resolveLabel(label: LocalizedLabel, currentLang: 'en' | 'es'): string {
		if (typeof label === 'string') return label;
		return t(label, currentLang);
	}

	let {
		work = [],
		education = [],
		certifications = [],
		progress = 1,
		mode = 'full'
	}: {
		work?: WorkItem[];
		education?: EduItem[];
		certifications?: CertItem[];
		progress?: number;
		mode?: 'full' | 'certs';
	} = $props();

	const startDate = new Date('2019-01-01').getTime();
	const endDate = new Date('2026-08-01').getTime();
	const totalDuration = endDate - startDate;

	function dateToX(dateStr: string | null): number {
		if (!dateStr) return 100;
		const d = new Date(dateStr + '-01').getTime();
		const pct = ((d - startDate) / totalDuration) * 100;
		return Math.max(0, Math.min(100, pct));
	}

	let activeX = $derived(progress * 100);
	let hoveredItem = $state<string | null>(null);

	function getWorkYAndHeight(item: WorkItem) {
		const isConsultancy = item.type === 'work-consultancy';
		const isSofka = item.id === 'sofka';

		if (isSofka) {
			return { y: 35, height: 49, textY: 47, isConsultancy, isSofka };
		}
		if (isConsultancy) {
			// L.O. Trading overlaps in time with BMC (May 2024 - Dec 2024 vs Feb 2024 - Dec 2024)
			// Place L.O. Trading on sub-row 2 inside Sofka (y = 68) to separate vertically
			const y = item.id === 'lotrading' ? 68 : 52;
			const height = 14;
			return { y, height, textY: y + 11, isConsultancy, isSofka };
		}
		if (item.id === 'zanacode') {
			// Zanacode overlaps in time with Firplak (Feb 2023 - Nov 2023 vs Nov 2021 - Dec 2023)
			// Place Zanacode on row 2 (y = 60) to separate vertically
			const y = 60;
			const height = 20;
			return { y, height, textY: y + 14, isConsultancy, isSofka };
		}
		// Primary work items (firplak, templ8r, etc.)
		const y = 35;
		const height = 20;
		return { y, height, textY: y + 14, isConsultancy, isSofka };
	}

	function truncateLabel(label: string, width: number, fontSize: number = 10): string {
		const availableWidth = width - 14;
		if (availableWidth < 18) return '';

		const charWidth = fontSize === 10 ? 5.8 : 6.4;
		const maxChars = Math.floor(availableWidth / charWidth);

		if (label.length <= maxChars) {
			return label;
		}
		if (maxChars <= 2) return '';
		return label.slice(0, Math.max(1, maxChars - 1)) + '…';
	}

	const ACCENT = theme.accent1;
	const CONSULTANCY = theme.accent2;
	const EDUCATION = '#4aa1d8';
	const CERT = '#c5da7f';
	const MUTED = theme.fgSubtle;
	const INK = theme.fg;
</script>

<div class="card">
	<header class="card-head">
		<h3 class="card-title">
			{#if mode === 'certs'}
				{$lang === 'es' ? 'Certificaciones & hitos' : 'Certifications & milestones'}
			{:else}
				{$lang === 'es' ? 'Cronología de carrera' : 'Career chronology'}
			{/if}
		</h3>
		<div class="legend">
			{#if mode === 'full'}
				<span><i class="lg lg-accent"></i> {$lang === 'es' ? 'Trabajo' : 'Work'}</span>
				<span><i class="lg lg-sand"></i> {$lang === 'es' ? 'Consultoría' : 'Consultancy'}</span>
				<span><i class="lg lg-teal"></i> {$lang === 'es' ? 'Educación' : 'Education'}</span>
			{/if}
			<span><i class="lg lg-warm"></i> {$lang === 'es' ? 'Certificaciones' : 'Certifications'}</span>
		</div>
	</header>

	<div class="svg-shell">
		<svg viewBox="0 0 1000 {mode === 'certs' ? 360 : 300}" class="svg-timeline" preserveAspectRatio="none">
			{#each [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] as year}
				{@const x = (dateToX(`${year}-01`) / 100) * 1000}
				<line x1={x} y1="0" x2={x} y2={mode === 'certs' ? 350 : 280} stroke="rgba(242,232,207,0.06)" stroke-dasharray="4 4" />
			{/each}

			{#if mode === 'full'}
				<text x="0" y="20" fill={MUTED} font-size="11" font-family="'Fredoka', sans-serif" font-weight="600">{$lang === 'es' ? 'Trabajo' : 'Work'}</text>

				{#each work as item, i}
					{@const startX = (dateToX(item.start) / 100) * 1000}
					{@const endX = (dateToX(item.end) / 100) * 1000}
					{@const width = Math.max(12, endX - startX)}
					{@const layout = getWorkYAndHeight(item)}
					{@const active = dateToX(item.start) <= activeX}
					{@const fontSize = layout.isConsultancy ? 10 : 11}
					{@const label = resolveLabel(item.label, $lang)}
					{@const displayText = truncateLabel(label, width, fontSize)}

					<g
						role="graphics-symbol"
						aria-label={label}
						class="gantt-item"
						opacity={active ? (hoveredItem && hoveredItem !== label ? 0.3 : 1) : 0.2}
						onmouseenter={() => (hoveredItem = label)}
						onmouseleave={() => (hoveredItem = null)}
					>
						<title>{label}</title>
						<rect
							x={startX}
							y={layout.y}
							width={width}
							height={layout.height}
							rx={4}
							fill={layout.isConsultancy ? CONSULTANCY : layout.isSofka ? theme.accent1Soft : ACCENT}
							stroke={layout.isSofka ? ACCENT : 'none'}
							stroke-width={layout.isSofka ? 1.5 : 0}
							stroke-dasharray={layout.isSofka ? '4 2' : 'none'}
						/>
						{#if displayText}
							<text
								x={startX + 8}
								y={layout.textY}
								fill={INK}
								font-size={fontSize}
								font-family="'Fredoka', sans-serif"
								font-weight="500"
								class="pointer-events-none"
							>
								{displayText}
							</text>
						{/if}
					</g>
				{/each}

				<text x="0" y="155" fill={MUTED} font-size="11" font-family="'Fredoka', sans-serif" font-weight="600">{$lang === 'es' ? 'Educación' : 'Education'}</text>

				{#each education as item, i}
					{@const startX = (dateToX(item.start) / 100) * 1000}
					{@const endX = (dateToX(item.end) / 100) * 1000}
					{@const width = Math.max(12, endX - startX)}
					{@const y = 170 + i * 20}
					{@const active = dateToX(item.start) <= activeX}
					{@const label = resolveLabel(item.label, $lang)}
					{@const displayText = truncateLabel(label, width, 10)}

					<g
						role="graphics-symbol"
						aria-label={label}
						class="gantt-item"
						opacity={active ? (hoveredItem && hoveredItem !== label ? 0.3 : 1) : 0.2}
						onmouseenter={() => (hoveredItem = label)}
						onmouseleave={() => (hoveredItem = null)}
					>
						<title>{label}</title>
						<rect x={startX} y={y} width={width} height="14" rx="4" fill={EDUCATION} opacity="0.85" />
						{#if displayText}
							<text x={startX + 6} y={y + 11} fill={INK} font-size="10" font-family="'Fredoka', sans-serif" font-weight="500" class="pointer-events-none">
								{displayText}
							</text>
						{/if}
					</g>
				{/each}

				<text x="0" y="255" fill={MUTED} font-size="11" font-family="'Fredoka', sans-serif" font-weight="600">{$lang === 'es' ? 'Certificaciones' : 'Certifications'}</text>

				{#each certifications as cert, i}
					{@const cx = (dateToX(cert.date) / 100) * 1000}
					{@const cy = 270 + (i % 2) * 12}
					{@const active = dateToX(cert.date) <= activeX}
					{@const label = resolveLabel(cert.label, $lang)}

					<g
						role="graphics-symbol"
						aria-label={label}
						class="gantt-item"
						opacity={active ? (hoveredItem && hoveredItem !== label ? 0.3 : 1) : 0.2}
						onmouseenter={() => (hoveredItem = label)}
						onmouseleave={() => (hoveredItem = null)}
					>
						<circle cx={cx} cy={cy} r="4" fill={CERT} />
					</g>
				{/each}
			{:else}
				<text x="0" y="24" fill={MUTED} font-size="11" font-family="'Fredoka', sans-serif" font-weight="600">{$lang === 'es' ? 'Cronología de Certificaciones' : 'Certifications Timeline'}</text>
				{#each certifications as cert, i}
					{@const cx = (dateToX(cert.date) / 100) * 1000}
					{@const cy = 45 + i * 22}
					{@const active = dateToX(cert.date) <= activeX}
					{@const isRightHalf = cx > 500}
					{@const textX = isRightHalf ? Math.max(10, cx - 10) : Math.min(990, cx + 10)}
					{@const textAnchor = isRightHalf ? 'end' : 'start'}
					{@const label = resolveLabel(cert.label, $lang)}

					<g
						role="graphics-symbol"
						aria-label={label}
						class="gantt-item"
						opacity={active ? (hoveredItem && hoveredItem !== label ? 0.3 : 1) : 0.2}
						onmouseenter={() => (hoveredItem = label)}
						onmouseleave={() => (hoveredItem = null)}
					>
						<title>{label} ({cert.date})</title>
						<line x1={cx} y1="35" x2={cx} y2={cy} stroke={CERT} stroke-width="1" opacity="0.3" stroke-dasharray="2 2" />
						<circle cx={cx} cy={cy} r="4" fill={CERT} />
						<text
							x={textX}
							y={cy + 4}
							text-anchor={textAnchor}
							fill={INK}
							font-size="10.5"
							font-family="'Fredoka', sans-serif"
							font-weight="500"
						>
							{label} ({cert.date})
						</text>
					</g>
				{/each}
			{/if}

			<g class="pointer-events-none">
				<line
					x1={(activeX / 100) * 1000}
					y1="0"
					x2={(activeX / 100) * 1000}
					y2={mode === 'certs' ? 350 : 280}
					stroke={ACCENT}
					stroke-width="1.5"
					stroke-dasharray="6 4"
					opacity="0.7"
				/>
			</g>
		</svg>
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
		gap: 1.25rem;
	}

	.card-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.card-title {
		margin: 0;
		font-size: 13px;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		letter-spacing: 0.02em;
		text-transform: none;
		color: var(--color-ink);
		font-weight: 600;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		color: var(--color-ink-subtle);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.lg {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		display: inline-block;
	}

	.lg-accent {
		background: #a7c957;
	}
	.lg-sand {
		background: #1982c4;
	}
	.lg-teal {
		background: #4aa1d8;
	}
	.lg-warm {
		background: #c5da7f;
	}

	.svg-shell {
		width: 100%;
		overflow-x: auto;
	}

	.svg-timeline {
		width: 100%;
		min-width: 700px;
		height: auto;
	}

	.gantt-item {
		cursor: pointer;
		transition: opacity 0.25s ease;
	}
</style>
