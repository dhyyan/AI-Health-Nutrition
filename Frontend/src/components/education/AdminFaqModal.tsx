import React, { useState, useEffect } from 'react';
import { X, HelpCircle, AlertCircle } from 'lucide-react';
import { Faq, FaqCategory, CreateFaqDTO } from '../../types/education.types';

interface AdminFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateFaqDTO) => Promise<boolean>;
  editingFaq: Faq | null;
}

export const AdminFaqModal: React.FC<AdminFaqModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingFaq,
}) => {
  const [formData, setFormData] = useState<CreateFaqDTO>({
    question: '',
    answer: '',
    category: 'General',
    order: 1,
    isPublished: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingFaq) {
      setFormData({
        question: editingFaq.question || '',
        answer: editingFaq.answer || '',
        category: editingFaq.category || 'General',
        order: editingFaq.order || 1,
        isPublished: editingFaq.isPublished ?? true,
      });
      setErrorMsg('');
    } else {
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        order: 1,
        isPublished: true,
      });
      setErrorMsg('');
    }
  }, [editingFaq, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      setErrorMsg('Please enter both Question and Answer fields.');
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
      setErrorMsg(err.message || 'Failed to save FAQ entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingFaq ? 'Edit FAQ Entry' : 'Create New FAQ Entry'}
              </h2>
              <p className="text-xs text-slate-400">Add question and clear answer for users</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Question *
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. How does NutriAI estimate calorie requirements?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as FaqCategory })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="General">General</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Exercise">Exercise</option>
                <option value="Disease Prevention">Disease Prevention</option>
                <option value="App Usage">App Usage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Sort Order Priority
              </label>
              <input
                type="number"
                min="1"
                value={formData.order || 1}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Answer *
            </label>
            <textarea
              required
              rows={4}
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Provide a helpful, precise explanation..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
              />
              <span>Publish FAQ Entry Immediately</span>
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
              {isSubmitting ? 'Saving...' : editingFaq ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
