import React, { useState } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  HelpCircle,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';
import { useEducation } from '../../hooks/useEducation';
import { AdminArticleModal } from '../../components/education/AdminArticleModal';
import { AdminFaqModal } from '../../components/education/AdminFaqModal';
import { Article, Faq, ArticleCategory, FaqCategory } from '../../types/education.types';

export const AdminEducationPage: React.FC = () => {
  const {
    articles,
    loadingArticles,
    articleCategory,
    setArticleCategory,
    articleSearch,
    setArticleSearch,
    faqs,
    loadingFaqs,
    faqCategory,
    setFaqCategory,
    faqSearch,
    setFaqSearch,
    handleSaveArticle,
    handleRemoveArticle,
    handleSaveFaq,
    handleRemoveFaq,
  } = useEducation(true);

  const [activeTab, setActiveTab] = useState<'articles' | 'faqs'>('articles');

  // Article Modal State
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // FAQ Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // Handlers for Article Modal
  const openCreateArticleModal = () => {
    setEditingArticle(null);
    setIsArticleModalOpen(true);
  };

  const openEditArticleModal = (article: Article) => {
    setEditingArticle(article);
    setIsArticleModalOpen(true);
  };

  // Handlers for FAQ Modal
  const openCreateFaqModal = () => {
    setEditingFaq(null);
    setIsFaqModalOpen(true);
  };

  const openEditFaqModal = (faq: Faq) => {
    setEditingFaq(faq);
    setIsFaqModalOpen(true);
  };

  const confirmDeleteArticle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this educational article?')) {
      await handleRemoveArticle(id);
    }
  };

  const confirmDeleteFaq = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ entry?')) {
      await handleRemoveFaq(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-outfit text-white">Health Education & FAQ Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create and edit health articles, exercise routines, disease prevention guides, and manage live FAQs.
          </p>
        </div>

        {/* Action Button */}
        {activeTab === 'articles' ? (
          <button
            onClick={openCreateArticleModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-90 transition flex items-center space-x-2 shrink-0 shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </button>
        ) : (
          <button
            onClick={openCreateFaqModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-90 transition flex items-center space-x-2 shrink-0 shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Create New FAQ</span>
          </button>
        )}
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'articles'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Articles & Guides ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'faqs'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ Center ({faqs.length})</span>
        </button>
      </div>

      {/* ARTICLES MANAGEMENT TAB */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder="Search articles by title, summary or tag..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={articleCategory}
              onChange={(e) => setArticleCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Topic Categories</option>
              <option value="healthy_food">Healthy Food</option>
              <option value="disease_prevention">Disease Prevention</option>
              <option value="exercise_guide">Exercise Guide</option>
              <option value="nutrition_awareness">Nutrition Awareness</option>
              <option value="lifestyle_tips">Lifestyle Improvement</option>
            </select>
          </div>

          {/* Articles Table */}
          {loadingArticles ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading educational articles...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Title & Teaser</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Read Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Created By</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2 font-bold text-white text-sm">
                            {article.isFeatured && (
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                            )}
                            <span className="line-clamp-1">{article.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {article.summary}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-slate-800 text-emerald-400 border border-slate-700">
                            {article.category.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-slate-300 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" /> {article.readTimeMinutes} min
                          </span>
                        </td>

                        <td className="p-4">
                          {article.isPublished ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle className="w-3 h-3" /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <XCircle className="w-3 h-3" /> Draft
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-400 text-[11px]">
                          {article.createdBy || 'Admin'}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openEditArticleModal(article)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Edit Article"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDeleteArticle(article.id)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
              No educational articles found. Click "Create New Article" to add one!
            </div>
          )}
        </div>
      )}

      {/* FAQ MANAGEMENT TAB */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {/* FAQ Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQ questions or answers..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={faqCategory}
              onChange={(e) => setFaqCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All FAQ Categories</option>
              <option value="General">General</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Exercise">Exercise</option>
              <option value="Disease Prevention">Disease Prevention</option>
              <option value="App Usage">App Usage</option>
            </select>
          </div>

          {/* FAQs Table */}
          {loadingFaqs ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading FAQ entries...</p>
            </div>
          ) : faqs.length > 0 ? (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Question & Answer Preview</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Order</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {faqs.map((faq) => (
                      <tr key={faq.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 max-w-md">
                          <div className="font-bold text-white text-sm">{faq.question}</div>
                          <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{faq.answer}</div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-slate-800 text-teal-400 border border-slate-700">
                            {faq.category}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-slate-300">#{faq.order}</td>

                        <td className="p-4">
                          {faq.isPublished ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle className="w-3 h-3" /> Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <XCircle className="w-3 h-3" /> Draft
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openEditFaqModal(faq)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Edit FAQ"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDeleteFaq(faq.id)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
              No FAQ entries found. Click "Create New FAQ" to create one!
            </div>
          )}
        </div>
      )}

      {/* Admin Article Modal */}
      <AdminArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSave={(data) => handleSaveArticle(data, editingArticle?.id)}
        editingArticle={editingArticle}
      />

      {/* Admin FAQ Modal */}
      <AdminFaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        onSave={(data) => handleSaveFaq(data, editingFaq?.id)}
        editingFaq={editingFaq}
      />
    </div>
  );
};

export default AdminEducationPage;
