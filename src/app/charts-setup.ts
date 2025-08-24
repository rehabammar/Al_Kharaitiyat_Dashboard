// import {
//   Chart,
//   CategoryScale,   // x axis
//   LinearScale,      // y axis
//   BarElement,
//   BarController,
//   Tooltip,
//   Legend,
//   PieController
// } from 'chart.js';
// import DatalabelsPlugin from 'chartjs-plugin-datalabels';

// Chart.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   BarController,
//   PieController,
//   Tooltip,
//   Legend,
//   DatalabelsPlugin // optional global registration
// );


// charts-setup.ts
import {
  Chart,
  // bars (keep if you also use bar charts)
  CategoryScale, LinearScale, BarElement, BarController,
  // ⬇️ pie/doughnut need these:
  ArcElement, PieController, DoughnutController,
  Tooltip, Legend
} from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

Chart.register(
  // keep your bar registerables if you use them:
  CategoryScale, LinearScale, BarElement, BarController,
  // pie/doughnut:
  ArcElement, PieController, DoughnutController,
  // common:
  Tooltip, Legend,
  // optional:
  DatalabelsPlugin
);
