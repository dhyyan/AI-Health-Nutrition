import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { Article, ArticleCategory, CreateArticleDTO, ExerciseStep } from '../../types/education.types';

interface AdminArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateArticleDTO) => Promise<boolean>;
  editingArticle: Article | null;
}

export const AdminArticleModal: React.FC<AdminArticleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingArticle,
}) => {
  const [formData, setFormData] = useState<CreateArticleDTO>({
    title: '',
    summary: '',
    content: '',
    category: 'healthy_food',
    readTimeMinutes: 3,
    imageUrl: '',
    tags: [],
    difficulty: 'Beginner',
    exerciseSteps: [],
    isPublished: true,
    isFeatured: false,
    medicalDisclaimer: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingArticle) {
      setFormData({
        title: editingArticle.title || '',
        summary: editingArticle.summary || '',
        content: editingArticle.content || '',
        category: editingArticle.category || 'healthy_food',
        readTimeMinutes: editingArticle.readTimeMinutes || 3,
        imageUrl: editingArticle.imageUrl || '',
        tags: editingArticle.tags || [],
        difficulty: editingArticle.difficulty || 'Beginner',
        exerciseSteps: editingArticle.exerciseSteps || [],
        isPublished: editingArticle.isPublished ?? true,
        isFeatured: editingArticle.isFeatured ?? false,
        medicalDisclaimer: editingArticle.medicalDisclaimer || '',
      });
      setTagInput('');
      setErrorMsg('');
    } else {
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: 'healthy_food',
        readTimeMinutes: 3,
        imageUrl: '',
        tags: [],
        difficulty: 'Beginner',
        exerciseSteps: [],
        isPublished: true,
        isFeatured: false,
        medicalDisclaimer: '',
      });
      setTagInput('');
      setErrorMsg('');
    }
  }, [editingArticle, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const tag = tagInput.trim();
      if (!formData.tags?.includes(tag)) {
        setFormData({ ...formData, tags: [...(formData.tags || []), tag] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  const handleAddStep = () => {
    const currentSteps = formData.exerciseSteps || [];
    const nextStepNum = currentSteps.length + 1;
    setFormData({
      ...formData,
      exerciseSteps: [
        ...currentSteps,
        { stepNumber: nextStepNum, title: '', description: '' },
      ],
    });
  };

  const handleUpdateStep = (index: number, field: 'title' | 'description', value: string) => {
    const currentSteps = [...(formData.exerciseSteps || [])];
    currentSteps[index] = { ...currentSteps[index], [field]: value };
    setFormData({ ...formData, exerciseSteps: currentSteps });
  };

  const handleRemoveStep = (index: number) => {
    const currentSteps = (formData.exerciseSteps || []).filter((_, i) => i !== index);
    const reordered = currentSteps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setFormData({ ...formData, exerciseSteps: reordered });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      setErrorMsg('Please fill in Title, Summary, and Content fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingArticle ? 'Edit Educational Article' : 'Create New Educational Article'}
              </h2>
              <p className="text-xs text-slate-400">Fill in guide details, step instructions & disclaimers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Top 10 Superfoods for Immunity"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Topic Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ArticleCategory })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="healthy_food">Healthy Food</option>
                <option value="disease_prevention">Disease Prevention</option>
                <option value="exercise_guide">Exercise Guide</option>
                <option value="nutrition_awareness">Nutrition Awareness</option>
                <option value="lifestyle_tips">Lifestyle Improvement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Summary / Short Teaser *
            </label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief 1-2 sentence overview displayed on article card..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Image URL
              </label>
              <input
                type="text"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Read Time (Mins)
              </label>
              <input
                type="number"
                min="1"
                value={formData.readTimeMinutes || 3}
                onChange={(e) =>
                  setFormData({ ...formData, readTimeMinutes: parseInt(e.target.value) || 3 })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty Level (Exercise)
              </label>
              <select
                value={formData.difficulty || 'Beginner'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced',
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Article Body / Content *
            </label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write comprehensive article markdown or formatted text..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Medical / Safety Disclaimer (Optional)
            </label>
            <input
              type="text"
              value={formData.medicalDisclaimer || ''}
              onChange={(e) => setFormData({ ...formData, medicalDisclaimer: e.target.value })}
              placeholder="Notice regarding non-medical advice..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Exercise Steps Manager */}
          {formData.category === 'exercise_guide' && (
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Exercise Steps Builder
                </span>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition flex items-center gap-1 border border-emerald-500/30"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
              </div>

              {(formData.exerciseSteps || []).map((step, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Step #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Step title (e.g. World's Greatest Stretch)"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    placeholder="Step description and posture guidelines..."
                    value={step.description}
                    onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Article Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag and press Enter or Add"
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.tags || []).map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
              />
              <span>Publish Article Immediately</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
              />
              <span>Feature Article on Top</span>
            </label>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Article...' : editingArticle ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
