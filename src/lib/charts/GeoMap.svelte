<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser, dev } from '$app/environment';
	import { lang } from '$lib/stores/lang';
	import { theme } from '$lib/utils/theme';

	interface Location {
		country: string;
		city: string;
		lat: number;
		lng: number;
		verified?: boolean;
	}

	interface CompanyRef {
		name: string;
		industries?: string[];
	}

	interface ExperienceItem {
		id: string;
		company: string | CompanyRef;
		role: string;
		clientLocation?: Location;
	}

	let { experiences = [] }: { experiences: ExperienceItem[] } = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let renderer: any;
	let animId: number;
	let webglAvailable = $state<boolean | null>(null);
	let tooltip = $state<{ x: number; y: number; label: string; color: string } | null>(null);

	const BASE = { lat: 6.2442, lng: -75.5812, city: 'Medellín', country: 'Colombia' };
	const DEST_COLORS = ['#4aa1d8', theme.accent2, '#f4a261', '#c5da7f', '#e07a5f'];

	function companyName(c: string | CompanyRef | undefined | null): string {
		if (!c) return '';
		return typeof c === 'string' ? c : c.name ?? '';
	}

	const withLocation = $derived(
		experiences.filter((e): e is ExperienceItem & { clientLocation: Location } => !!e.clientLocation)
	);

	const destinations = $derived.by(() => {
		const seen = new Map<string, { lat: number; lng: number; city: string; country: string; color: string }>();
		let idx = 0;
		for (const e of withLocation) {
			const { lat, lng, city, country } = e.clientLocation;
			if (Math.abs(lat - BASE.lat) < 0.5 && Math.abs(lng - BASE.lng) < 0.5) continue;
			const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
			if (seen.has(key)) continue;
			seen.set(key, { lat, lng, city, country, color: DEST_COLORS[idx % DEST_COLORS.length] });
			idx++;
		}
		return Array.from(seen.values());
	});

	const fallbackLocations = $derived.by(() => {
		const seen = new Map<string, { city: string; country: string; companies: string[] }>();
		for (const e of withLocation) {
			const { lat, lng, city, country } = e.clientLocation;
			if (Math.abs(lat - BASE.lat) < 0.5 && Math.abs(lng - BASE.lng) < 0.5) continue;
			const key = `${city}|${country}`;
			const name = companyName(e.company);
			const existing = seen.get(key);
			if (existing) {
				if (name && !existing.companies.includes(name)) existing.companies.push(name);
			} else {
				seen.set(key, { city, country, companies: name ? [name] : [] });
			}
		}
		return Array.from(seen.values());
	});

	function detectWebGL(): boolean {
		if (!browser) return false;
		try {
			const c = document.createElement('canvas');
			const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
			return !!gl;
		} catch {
			return false;
		}
	}

	onMount(async () => {
		if (dev) {
			experiences.forEach((exp) => {
				if (exp.clientLocation && exp.clientLocation.verified === false) {
					console.warn(
						`[GeoMap] Unverified location for ${companyName(exp.company)} (${exp.clientLocation.city}, ${exp.clientLocation.country}).`
					);
				}
			});
		}

		if (!browser || !containerEl) return;

		const supported = detectWebGL();
		webglAvailable = supported;
		if (!supported) return;

		try {
			const THREE = await import('three');
			const { default: ThreeGlobe } = await import('three-globe');
			const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');

			const points = [
				{ lat: BASE.lat, lng: BASE.lng, color: theme.accent1, city: `${BASE.city}, ${BASE.country}`, isBase: true },
				...destinations.map((d) => ({
					lat: d.lat,
					lng: d.lng,
					color: d.color,
					city: `${d.city}, ${d.country}`,
					isBase: false
				}))
			];

			const arcs = destinations.map((d) => ({
				startLat: BASE.lat,
				startLng: BASE.lng,
				endLat: d.lat,
				endLng: d.lng,
				color: [theme.accent1, d.color]
			}));

			const Globe = new ThreeGlobe()
				.globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
				.bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
				.pointsData(points)
				.pointColor('color')
				.pointAltitude(0.06)
				.pointRadius(0.8)
				.arcsData(arcs)
				.arcColor('color')
				.arcDashLength(0.4)
				.arcDashGap(0.2)
				.arcDashAnimateTime(2200)
				.arcStroke(1.2);

			const scene = new THREE.Scene();
			scene.add(Globe);
			scene.add(new THREE.AmbientLight(0xffffff, 0.9 * Math.PI));
			scene.add(new THREE.DirectionalLight(0xffffff, 0.5 * Math.PI));

			const width = containerEl.clientWidth || 600;
			let height = containerEl.clientHeight || 380;

			// Position camera facing Medellín using three-globe's polar2Cartesian formula
			const phi = (90 - BASE.lat) * Math.PI / 180;
			const theta = (90 - BASE.lng) * Math.PI / 180;
			const dir = new THREE.Vector3(
				Math.sin(phi) * Math.cos(theta),
				Math.cos(phi),
				Math.sin(phi) * Math.sin(theta)
			).normalize();

			const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
			camera.position.copy(dir.multiplyScalar(295));
			camera.lookAt(0, 0, 0);

			try {
				renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
			} catch {
				webglAvailable = false;
				return;
			}

			renderer.setSize(width, height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			containerEl.appendChild(renderer.domElement);
			renderer.domElement.style.cursor = 'grab';

			const controls = new OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true;
			controls.dampingFactor = 0.08;
			controls.enablePan = false;
			controls.enableZoom = false;
			controls.rotateSpeed = 0.6;
			controls.autoRotate = true;
			controls.autoRotateSpeed = 0.45;
			controls.target.set(0, 0, 0);

			controls.addEventListener('start', () => {
				controls.autoRotate = false;
				renderer.domElement.style.cursor = 'grabbing';
			});
			controls.addEventListener('end', () => {
				renderer.domElement.style.cursor = 'grab';
			});

			const hoverTargets = points.map((p) => {
				const c = (Globe as any).getCoords(p.lat, p.lng, 0.06);
				return { ...p, local: new THREE.Vector3(c.x, c.y, c.z) };
			});
			const worldVec = new THREE.Vector3();
			const camNorm = new THREE.Vector3();
			const HIT_RADIUS_PX = 20;

			const onPointerMove = (ev: PointerEvent) => {
				const rect = renderer.domElement.getBoundingClientRect();
				const mx = ev.clientX - rect.left;
				const my = ev.clientY - rect.top;
				camNorm.copy(camera.position).normalize();

				let best: { d: number; label: string; color: string; x: number; y: number } | null = null;
				for (const t of hoverTargets) {
					worldVec.copy(t.local).applyMatrix4(Globe.matrixWorld);
					if (worldVec.clone().normalize().dot(camNorm) < 0.1) continue;
					const projected = worldVec.clone().project(camera);
					if (projected.z > 1 || projected.z < -1) continue;
					const sx = (projected.x * 0.5 + 0.5) * rect.width;
					const sy = (1 - (projected.y * 0.5 + 0.5)) * rect.height;
					const d = Math.hypot(sx - mx, sy - my);
					if (d < HIT_RADIUS_PX && (!best || d < best.d)) {
						best = { d, label: t.city, color: t.color, x: sx, y: sy };
					}
				}
				tooltip = best ? { x: best.x, y: best.y, label: best.label, color: best.color } : null;
				renderer.domElement.style.cursor = best ? 'pointer' : 'grab';
			};
			const onPointerLeave = () => {
				tooltip = null;
				renderer.domElement.style.cursor = 'grab';
			};
			const onPointerEnter = () => {
				controls.autoRotate = false;
			};
			renderer.domElement.addEventListener('pointerenter', onPointerEnter);
			renderer.domElement.addEventListener('pointermove', onPointerMove);
			renderer.domElement.addEventListener('pointerleave', onPointerLeave);

			const animate = () => {
				controls.update();
				renderer.render(scene, camera);
				animId = requestAnimationFrame(animate);
			};
			animate();

			const handleResize = () => {
				if (!containerEl || !renderer || !camera) return;
				const w = containerEl.clientWidth;
				const h = containerEl.clientHeight || height;
				height = h;
				camera.aspect = w / h;
				camera.updateProjectionMatrix();
				renderer.setSize(w, h);
			};
			window.addEventListener('resize', handleResize);
			const ro = new ResizeObserver(handleResize);
			ro.observe(containerEl);
		} catch (err) {
			console.warn('[GeoMap] falling back to static list:', err);
			webglAvailable = false;
		}
	});

	onDestroy(() => {
		if (browser) {
			if (animId) cancelAnimationFrame(animId);
			if (renderer) renderer.dispose?.();
		}
	});
</script>

{#if webglAvailable === false}
	<div class="fallback">
		<h4 class="fallback-title">
			{$lang === 'es'
				? 'Regiones donde mi trabajo ha dejado huella'
				: 'Regions where my work has left a mark'}
		</h4>
		<ul class="loc-list">
			<li class="loc-item loc-home">
				<span class="loc-dot"></span>
				<div class="loc-body">
					<span class="loc-city">Medellín, Colombia</span>
					<span class="loc-role">{$lang === 'es' ? 'Base' : 'Home base'}</span>
				</div>
			</li>
			{#each fallbackLocations as loc (loc.city + '|' + loc.country)}
				<li class="loc-item">
					<span class="loc-dot loc-dot-soft"></span>
					<div class="loc-body">
						<span class="loc-city">{loc.city}, {loc.country}</span>
						{#if loc.companies.length}
							<span class="loc-role">{loc.companies.join(' · ')}</span>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<div bind:this={containerEl} class="globe-shell">
		{#if tooltip}
			<div
				class="globe-tooltip"
				style="left: {tooltip.x}px; top: {tooltip.y}px; --dot-color: {tooltip.color};"
			>
				<span class="globe-tooltip-dot"></span>
				{tooltip.label}
			</div>
		{/if}
	</div>
{/if}

<style>
	.globe-shell {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.globe-shell :global(canvas) {
		position: absolute;
		inset: 0;
	}

	.globe-tooltip {
		position: absolute;
		transform: translate(-50%, calc(-100% - 12px));
		pointer-events: none;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.6rem;
		border-radius: 6px;
		background: var(--color-surface);
		border: 1px solid var(--color-border-strong, var(--color-border));
		color: var(--color-ink);
		font-size: 12px;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		white-space: nowrap;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
		z-index: 2;
	}

	.globe-tooltip-dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: var(--dot-color, var(--color-accent));
	}

	.fallback {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 10px;
		background: var(--color-canvas-2);
		border: 1px solid var(--color-border);
	}

	.fallback-title {
		margin: 0;
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
		letter-spacing: 0.01em;
	}

	.loc-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 0.5rem;
	}

	.loc-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem 0.8rem;
		border-radius: 8px;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
	}

	.loc-dot {
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: var(--color-accent);
		flex-shrink: 0;
	}

	.loc-dot-soft {
		background: var(--color-accent-alt);
	}

	.loc-body {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}

	.loc-city {
		font-size: 13px;
		color: var(--color-ink);
	}

	.loc-role {
		font-family: 'Fredoka', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		color: var(--color-ink-subtle);
	}


</style>
