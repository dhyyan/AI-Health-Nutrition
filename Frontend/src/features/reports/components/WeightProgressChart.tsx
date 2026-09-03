import React from 'react';
import { HealthTrendsData } from '../../../services/reportApi';
import { Line } from 'react-chartjs-2';
import { Scale, TrendingDown, TrendingUp } from 'lucide-react';

interface WeightProgressChartProps {
  data: HealthTrendsData;
}

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({ data }) => {
  const shortDates = data.dates.map((d) => d.slice(5));

  const validWeights = data.weightKg.filter((w): w is number => w !== null);
  const startWeight = validWeights[0] || 70;
  const currentWeight = validWeights[validWeights.length - 1] || 70;
  const weightDiff = Math.round((currentWeight - startWeight) * 10) / 10;

  const chartData = {
    labels: shortDates,
    datasets: [
      {
        fill: true,
        label: 'Weight (kg)',
        data: data.weightKg,
        borderColor: '#10b981', // Emerald 500
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        tension: 0.3,
        borderWidth: 3,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Weight: ${context.parsed.y} kg`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1f5f9' },
        suggestedMin: Math.max(30, Math.min(...validWeights) - 3),
        suggestedMax: Math.max(...validWeights) + 3,
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-outfit text-slate-900">Weight Progress Trend</h3>
            <p className="text-xs text-slate-500 font-medium">Historical timeline of recorded body weight</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <div>
            <span className="text-xs font-medium text-slate-400 block">Current Weight</span>
            <span className="text-lg font-black text-slate-900">{currentWeight} kg</span>
          </div>
          {weightDiff !== 0 && (
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 ${
                weightDiff < 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {weightDiff < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              <span>{Math.abs(weightDiff)} kg</span>
            </span>
          )}
        </div>
      </div>

      <div className="h-72 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
