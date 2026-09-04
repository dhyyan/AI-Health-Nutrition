import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldAlert,
  Clock,
  Dumbbell,
  Apple,
  HeartPulse,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  Tag,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { useEducation } from '../../hooks/useEducation';
import { ArticleCategory, Article, FaqCategory } from '../../types/education.types';

export const HealthEducationPage: React.FC = () => {
  const {
    articles,
    loadingArticles,
    articleCategory,
    setArticleCategory,
    articleSearch,
    setArticleSearch,
    selectedArticle,
    isArticleModalOpen,
    viewArticleDetails,
    closeArticleModal,
    faqs,
    loadingFaqs,
    faqCategory,
    setFaqCategory,
    faqSearch,
    setFaqSearch,
  } = useEducation(false);

  const [activeTab, setActiveTab] = useState<'articles' | 'faqs'>('articles');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const articleCategoryTabs: { key: ArticleCategory | 'all'; label: string; icon: any }[] = [
    { key: 'all', label: 'All Knowledge', icon: BookOpen },
    { key: 'healthy_food', label: 'Healthy Food', icon: Apple },
    { key: 'disease_prevention', label: 'Disease Prevention', icon: ShieldAlert },
    { key: 'exercise_guide', label: 'Exercise Guides', icon: Dumbbell },
    { key: 'nutrition_awareness', label: 'Nutrition Awareness', icon: HeartPulse },
    { key: 'lifestyle_tips', label: 'Lifestyle & Wellness', icon: Sparkles },
  ];

  const faqCategoryTabs: (FaqCategory | 'all')[] = [
    'all',
    'General',
    'Nutrition',
    'Exercise',
    'Disease Prevention',
    'App Usage',
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const getCategoryBadgeClass = (category: ArticleCategory) => {
    switch (category) {
      case 'healthy_food':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'disease_prevention':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'exercise_guide':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'nutrition_awareness':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'lifestyle_tips':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryLabel = (category: ArticleCategory) => {
    switch (category) {
      case 'healthy_food':
        return 'Healthy Food';
      case 'disease_prevention':
        return 'Disease Prevention';
      case 'exercise_guide':
        return 'Exercise Guide';
      case 'nutrition_awareness':
        return 'Nutrition Awareness';
      case 'lifestyle_tips':
        return 'Lifestyle Tip';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* Hero Header Section */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 text-white py-14 px-6 sm:px-10 lg:px-16 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1680px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> Educational Knowledge Center
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-outfit tracking-tight">
                Health Education & Wellness Guides
              </h1>
              <p className="text-slate-200 text-base sm:text-lg max-w-3xl leading-relaxed">
                Explore evidence-informed articles on nutrition, exercise routines, preventive wellness habits, and healthy eating choices.
              </p>
            </div>

            {/* Quick Stats / Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-3xl flex items-center gap-5 text-slate-100 shrink-0 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-3xl">
                📚
              </div>
              <div>
                <div className="text-xs sm:text-sm text-slate-300 uppercase tracking-wider font-extrabold">
                  Verified Guides
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{articles.length} Educational Topics</div>
              </div>
            </div>
          </div>

          {/* Medical Safety Disclaimer Callout Banner */}
          <div className="mt-8 p-5 bg-amber-500/15 border border-amber-400/30 rounded-2xl flex items-start gap-4 text-amber-200 text-xs sm:text-base leading-relaxed">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Important Educational Disclaimer: </span>
              All content provided in this section is for general wellness education only. It is not intended as medical diagnosis, treatment, or professional healthcare advice. Always consult a qualified medical provider for personal conditions.
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-16 mt-10 space-y-8">
        {/* Main Tab Switcher (Articles vs FAQ) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-base font-extrabold transition-all ${
                activeTab === 'articles'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Articles & Guides</span>
              <span className="ml-1 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-base font-extrabold transition-all ${
                activeTab === 'faqs'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Frequently Asked Questions (FAQ)</span>
              <span className="ml-1 bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">
                {faqs.length}
              </span>
            </button>
          </div>
        </div>

        {/* ARTICLES & GUIDES VIEW */}
        {activeTab === 'articles' && (
          <div>
            {/* Category Filter Pills & Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                {articleCategoryTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = articleCategory === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setArticleCategory(tab.key)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles, guides or tags..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            {/* Articles Grid */}
            {loadingArticles ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse space-y-4">
                    <div className="h-44 bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-12 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No educational articles found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search query or selecting a different topic category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                            <BookOpen className="w-12 h-12 opacity-80" />
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border shadow-sm ${getCategoryBadgeClass(
                              article.category
                            )}`}
                          >
                            {getCategoryLabel(article.category)}
                          </span>
                        </div>

                        {article.difficulty && (
                          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                            <Dumbbell className="w-3 h-3" /> {article.difficulty}
                          </div>
                        )}
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{article.readTimeMinutes} min read</span>
                          <span>•</span>
                          <span>{article.createdBy || 'NutriAI Education'}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                          {article.summary}
                        </p>

                        {/* Tags list */}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {article.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                              >
                                <Tag className="w-2.5 h-2.5 text-slate-400" /> {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => viewArticleDetails(article.id)}
                        className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm group-hover:bg-emerald-600"
                      >
                        <span>{article.category === 'exercise_guide' ? 'View Exercise Guide' : 'Read Article'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ ACCORDION VIEW */}
        {activeTab === 'faqs' && (
          <div>
            {/* FAQ Search & Category Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {faqCategoryTabs.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      faqCategory === cat
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search FAQ questions..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            {/* Accordions List */}
            {loadingFaqs ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 bg-slate-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : faqs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No FAQ entries found</h3>
                <p className="text-xs text-slate-500 mt-1">Try selecting another FAQ category or adjusting search.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq) => {
                  const isOpen = expandedFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`bg-white rounded-2xl border transition-all ${
                        isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-md' : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                            Q
                          </span>
                          <span>{faq.question}</span>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="hidden sm:inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">
                            {faq.category}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 mt-1">
                          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>{faq.answer}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ARTICLE READER DETAIL MODAL */}
      {isArticleModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header Image */}
            <div className="relative h-64 sm:h-72 bg-slate-900 flex-shrink-0">
              {selectedArticle.imageUrl ? (
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-emerald-950 to-teal-900 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-16 h-16" />
                </div>
              )}

              <button
                onClick={closeArticleModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider border shadow-md ${getCategoryBadgeClass(
                    selectedArticle.category
                  )}`}
                >
                  {getCategoryLabel(selectedArticle.category)}
                </span>
                <span className="text-xs font-semibold bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> {selectedArticle.readTimeMinutes} Min Read
                </span>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
                  {selectedArticle.title}
                </h2>
                <p className="text-slate-500 text-xs font-semibold mt-1">
                  Published by {selectedArticle.createdBy || 'NutriAI Health Team'}
                </p>
              </div>

              {/* Medical Disclaimer Banner */}
              {selectedArticle.medicalDisclaimer && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Health Notice: </span>
                    {selectedArticle.medicalDisclaimer}
                  </div>
                </div>
              )}

              {/* Exercise Step-by-Step Guide Section (If category is exercise_guide) */}
              {selectedArticle.category === 'exercise_guide' &&
                selectedArticle.exerciseSteps &&
                selectedArticle.exerciseSteps.length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Dumbbell className="w-4 h-4 text-emerald-600" />
                      <span>Step-by-Step Movement Routine</span>
                      {selectedArticle.difficulty && (
                        <span className="ml-auto text-xs px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md">
                          {selectedArticle.difficulty} Level
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {selectedArticle.exerciseSteps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-start gap-3"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            {step.stepNumber}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h4>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Main Content Paragraphs */}
              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                {selectedArticle.content}
              </div>

              {/* Key Takeaways Card */}
              <div className="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-emerald-950">
                <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800">Actionable Key Takeaway</h4>
                  <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                    {selectedArticle.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={closeArticleModal}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
