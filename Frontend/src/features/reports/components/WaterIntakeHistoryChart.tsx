import React from 'react';
import { HealthTrendsData } from '../../../services/reportApi';
import { Bar } from 'react-chartjs-2';
import { Droplet } from 'lucide-react';

interface WaterIntakeHistoryChartProps {
  data: HealthTrendsData;
}

export const WaterIntakeHistoryChart: React.FC<WaterIntakeHistoryChartProps> = ({ data }) => {
  const shortDates = data.dates.map((d) => d.slice(5));

  const totalWater = data.waterMl.reduce((acc, curr) => acc + curr, 0);
  const avgWater = Math.round(totalWater / (data.waterMl.length || 1));

  const chartData = {
    labels: shortDates,
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: data.waterMl,
        backgroundColor: '#06b6d4', // Cyan 500
        borderRadius: 8,
        hoverBackgroundColor: '#0891b2',
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
          label: (context: any) => `Water: ${context.parsed.y} ml`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-outfit text-slate-900">Hydration Records History</h3>
            <p className="text-xs text-slate-500 font-medium">Daily water intake comparison</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-cyan-50/80 px-4 py-2 rounded-2xl border border-cyan-100 self-start sm:self-auto text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Avg Intake</span>
            <span className="text-sm font-black text-cyan-900">{avgWater} ml/day</span>
          </div>
          <div className="w-px h-6 bg-cyan-200" />
          <div>
            <span className="text-slate-500 font-medium block">Total Hydration</span>
            <span className="text-sm font-black text-cyan-900">{(totalWater / 1000).toFixed(1)} L</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
