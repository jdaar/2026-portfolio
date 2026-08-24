<script lang="ts">
	import { formatNumber } from '$lib/utils/format';
	import { lang } from '$lib/stores/lang';
	import { reducedMotion } from '$lib/stores/motion';

	let {
		numericValue = 0,
		displayValue = '',
		unit = '',
		formatHint = 'integer',
		prefix = '',
		suffix = '',
		label = '',
		progress = 1,
		endAtProgress = 0.75,
		color = ''
	}: {
		numericValue?: number;
		displayValue?: string;
		unit?: string;
		formatHint?: string;
		prefix?: string;
		suffix?: string;
		label?: string;
		progress?: number;
		endAtProgress?: number;
		color?: string;
	} = $props();

	let normalizedProgress = $derived.by(() => {
		if ($reducedMotion) return 1;
		if (endAtProgress <= 0) return 1;
		return Math.min(1, Math.max(0, progress / endAtProgress));
	});

	let computedColor = $derived.by(() => {
		if (!color) return '';
		if (color === 'accent1' || color === 'accent') return 'var(--color-accent)';
		if (color === 'accent2' || color === 'accent-alt') return 'var(--color-accent-alt)';
		return color;
	});

	let currentValue = $derived.by(() => {
		if ($reducedMotion || normalizedProgress >= 1) {
			const base = displayValue || formatNumber(numericValue, formatHint, $lang);
			const full = prefix + base;
			return suffix && !full.endsWith(suffix) ? full + suffix : full;
		}
		const interp = numericValue * normalizedProgress;
		const base = formatNumber(interp, formatHint, $lang);
		const full = prefix + base;
		return suffix && !full.endsWith(suffix) ? full + suffix : full;
	});
</script>

<div class="stat" class:has-custom-color={!!computedColor} style={computedColor ? `--stat-color: ${computedColor}` : ''}>
	<div class="stat-value-row">
		<span class="sr-only">{displayValue || currentValue} {unit} {label}</span>
		<span class="stat-value">{currentValue}</span>
		{#if unit}
			<span class="stat-unit">{unit}</span>
		{/if}
	</div>

	{#if label}
		<p class="stat-label">{label}</p>
	{/if}

	<div class="stat-track">
		<div class="stat-track-fill" style="width: {Math.min(100, Math.max(0, normalizedProgress * 100))}%"></div>
	</div>
</div>

<style>
	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 1.15rem 1.25rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		transition: border-color 0.2s ease, background 0.2s ease;
	}

	.stat:hover {
		border-color: var(--color-border-strong);
		background: var(--color-surface-2);
	}

	.stat-value-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.stat-value {
		font-size: clamp(1.75rem, 3.4vw, 2.4rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		color: var(--color-ink);
		line-height: 1;
	}

	.stat-unit {
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		color: var(--color-ink-subtle);
		text-transform: lowercase;
		letter-spacing: 0.04em;
	}

	.stat-label {
		margin: 0;
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--color-ink-muted);
	}

	.stat-track {
		height: 2px;
		width: 100%;
		background: var(--color-border);
		border-radius: 999px;
		overflow: hidden;
	}

	.stat-track-fill {
		height: 100%;
		background: var(--stat-color, var(--color-accent));
		transition: width 0.15s ease-out;
	}

	.stat.has-custom-color .stat-value {
		color: var(--stat-color);
	}

	.stat.has-custom-color .stat-label {
		color: var(--stat-color);
	}

	.stat.has-custom-color .stat-unit {
		color: var(--stat-color);
		opacity: 0.85;
	}
</style>
