import { browser } from '$app/environment';

export async function getChartJS() {
	if (!browser) return null;
	const ChartModule = await import('chart.js');
	const {
		Chart,
		LineController,
		LineElement,
		PointElement,
		DoughnutController,
		ArcElement,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend,
		Filler
	} = ChartModule;

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		DoughnutController,
		ArcElement,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend,
		Filler
	);

	return Chart;
}
