import React from 'react';
import { HealthTrendsData } from '../../../services/reportApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Flame, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface NutritionAnalysisChartProps {
  data: HealthTrendsData;
}

export const NutritionAnalysisChart: React.FC<NutritionAnalysisChartProps> = ({ data }) => {
  const shortDates = data.dates.map((d) => d.slice(5));

  const calorieLineData = {
    labels: shortDates,
    datasets: [
      {
        fill: true,
        label: 'Calories (kcal)',
        data: data.calories,
        borderColor: '#f59e0b', // Amber 500
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.35,
        borderWidth: 3,
        pointBackgroundColor: '#f59e0b',
        pointRadius: 3,
      },
    ],
  };

  const macroBarData = {
    labels: shortDates,
    datasets: [
      {
        label: 'Protein (g)',
        data: data.protein,
        backgroundColor: '#0284c7', // Sky 600
        borderRadius: 6,
      },
      {
        label: 'Carbs (g)',
        data: data.carbohydrates,
        backgroundColor: '#f59e0b', // Amber 500
        borderRadius: 6,
      },
      {
        label: 'Fat (g)',
        data: data.fat,
        backgroundColor: '#e11d48', // Rose 600
        borderRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calories Over Time Graph */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">Calorie Intake Trend</h3>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            kcal / day
          </span>
        </div>
        <div className="h-64 w-full flex-1">
          <Line data={calorieLineData} options={lineOptions} />
        </div>
      </div>

      {/* Macronutrient Split Graph */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-outfit">Macronutrient Split Over Time</h3>
          </div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
            grams / day
          </span>
        </div>
        <div className="h-64 w-full flex-1">
          <Bar data={macroBarData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};
