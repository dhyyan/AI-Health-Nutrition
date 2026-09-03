import React from 'react';
import { HealthTrendsData } from '../../../services/reportApi';
import { Line } from 'react-chartjs-2';
import { Activity, ShieldCheck } from 'lucide-react';

interface BMIHistoryChartProps {
  data: HealthTrendsData;
}

export const BMIHistoryChart: React.FC<BMIHistoryChartProps> = ({ data }) => {
  const shortDates = data.dates.map((d) => d.slice(5));

  const validBmi = data.bmi.filter((b): b is number => b !== null);
  const latestBmi = validBmi[validBmi.length - 1] || 22.5;

  let category = 'Normal';
  if (latestBmi < 18.5) category = 'Underweight';
  else if (latestBmi < 25) category = 'Normal';
  else if (latestBmi < 30) category = 'Overweight';
  else category = 'Obese';

  const chartData = {
    labels: shortDates,
    datasets: [
      {
        fill: false,
        label: 'BMI Trend',
        data: data.bmi,
        borderColor: '#8b5cf6', // Violet 500
        tension: 0.3,
        borderWidth: 3,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 4,
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
          label: (context: any) => `BMI: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1f5f9' },
        suggestedMin: 15,
        suggestedMax: 32,
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-outfit text-slate-900">BMI History & Trajectory</h3>
            <p className="text-xs text-slate-500 font-medium">Historical Body Mass Index trends</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-purple-50/80 px-4 py-2 rounded-2xl border border-purple-100 self-start sm:self-auto">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <div>
            <span className="text-xs font-semibold text-purple-700 block">Current Category</span>
            <span className="text-sm font-black text-purple-900">{latestBmi} ({category})</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Threshold Reference Indicator Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-blue-50 text-blue-700 font-semibold">
          Underweight: &lt; 18.5
        </div>
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold">
          Normal: 18.5 - 24.9
        </div>
        <div className="p-2 rounded-xl bg-amber-50 text-amber-700 font-semibold">
          Overweight: 25.0 - 29.9
        </div>
        <div className="p-2 rounded-xl bg-rose-50 text-rose-700 font-semibold">
          Obese: &ge; 30.0
        </div>
      </div>
    </div>
  );
};
