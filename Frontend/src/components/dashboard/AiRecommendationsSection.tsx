import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface RecommendationItem {
  id: string;
  category: string;
  title: string;
  suggestion: string;
  tag: string;
  impactLevel?: string;
}

interface AiRecommendationsSectionProps {
  recommendations: RecommendationItem[];
}

export const AiRecommendationsSection: React.FC<AiRecommendationsSectionProps> = ({
  recommendations = [],
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">AI Personalized Recommendations</h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1">
              Data-driven suggestions tailored to your daily activity, goals, and nutrition.
            </p>
          </div>
        </div>
        <Link
          to="/recommendations"
          className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base transition shadow-md shrink-0"
        >
          View Full Engine Recommendations →
        </Link>
      </div>

      {/* Suggestions Cards Grid */}
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec: RecommendationItem) => (
            <div
              key={rec.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-7 border border-white/15 flex flex-col justify-between space-y-4 hover:bg-white/15 transition"
            >
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-400/30">
                  {rec.tag}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                  {rec.category}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-white text-lg sm:text-xl font-outfit">{rec.title}</h4>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-2">{rec.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base text-slate-300 font-medium">
          Log your meals and water intake to receive personalized real-time AI recommendations.
        </p>
      )}
    </div>
  );
};
