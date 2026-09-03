import { useState, useEffect, useCallback } from 'react';
import {
  Article,
  Faq,
  ArticleCategory,
  FaqCategory,
  CreateArticleDTO,
  CreateFaqDTO,
} from '../types/education.types';
import {
  getPublicArticles,
  getArticleDetails,
  getPublicFaqs,
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from '../services/educationApi';

export const useEducation = (isAdminMode = false) => {
  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(true);
  const [articleCategory, setArticleCategory] = useState<ArticleCategory | 'all'>('all');
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);

  // FAQs state
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState<boolean>(true);
  const [faqCategory, setFaqCategory] = useState<FaqCategory | 'all'>('all');
  const [faqSearch, setFaqSearch] = useState<string>('');

  // General error handling state
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Load articles
  const loadArticles = useCallback(async () => {
    try {
      setLoadingArticles(true);
      setError(null);
      const params: any = {};
      if (articleCategory !== 'all') params.category = articleCategory;
      if (articleSearch.trim()) params.search = articleSearch.trim();

      const data = isAdminMode
        ? await getAdminArticles(params)
        : await getPublicArticles(params);
      setArticles(data);
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.response?.data?.message || 'Failed to load articles');
    } finally {
      setLoadingArticles(false);
    }
  }, [articleCategory, articleSearch, isAdminMode]);

  // Load FAQs
  const loadFaqs = useCallback(async () => {
    try {
      setLoadingFaqs(true);
      setError(null);
      const params: any = {};
      if (faqCategory !== 'all') params.category = faqCategory;
      if (faqSearch.trim()) params.search = faqSearch.trim();

      const data = isAdminMode ? await getAdminFaqs(params) : await getPublicFaqs(params);
      setFaqs(data);
    } catch (err: any) {
      console.error('Error fetching FAQs:', err);
      setError(err.response?.data?.message || 'Failed to load FAQs');
    } finally {
      setLoadingFaqs(false);
    }
  }, [faqCategory, faqSearch, isAdminMode]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  // Open article details modal
  const viewArticleDetails = async (id: string) => {
    try {
      setActionLoading(true);
      const detail = await getArticleDetails(id);
      setSelectedArticle(detail);
      setIsArticleModalOpen(true);
    } catch (err: any) {
      console.error('Error fetching article detail:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const closeArticleModal = () => {
    setSelectedArticle(null);
    setIsArticleModalOpen(false);
  };

  // Admin Article Actions
  const handleSaveArticle = async (data: CreateArticleDTO, editingId?: string) => {
    try {
      setActionLoading(true);
      if (editingId) {
        await updateArticle(editingId, data);
      } else {
        await createArticle(data);
      }
      await loadArticles();
      return true;
    } catch (err: any) {
      console.error('Error saving article:', err);
      setError(err.response?.data?.message || 'Failed to save article');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveArticle = async (id: string) => {
    try {
      setActionLoading(true);
      await deleteArticle(id);
      await loadArticles();
      return true;
    } catch (err: any) {
      console.error('Error deleting article:', err);
      setError(err.response?.data?.message || 'Failed to delete article');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Admin FAQ Actions
  const handleSaveFaq = async (data: CreateFaqDTO, editingId?: string) => {
    try {
      setActionLoading(true);
      if (editingId) {
        await updateFaq(editingId, data);
      } else {
        await createFaq(data);
      }
      await loadFaqs();
      return true;
    } catch (err: any) {
      console.error('Error saving FAQ:', err);
      setError(err.response?.data?.message || 'Failed to save FAQ entry');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFaq = async (id: string) => {
    try {
      setActionLoading(true);
      await deleteFaq(id);
      await loadFaqs();
      return true;
    } catch (err: any) {
      console.error('Error deleting FAQ:', err);
      setError(err.response?.data?.message || 'Failed to delete FAQ entry');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    articles,
    loadingArticles,
    articleCategory,
    setArticleCategory,
    articleSearch,
    setArticleSearch,
    selectedArticle,
    setSelectedArticle,
    isArticleModalOpen,
    viewArticleDetails,
    closeArticleModal,
    faqs,
    loadingFaqs,
    faqCategory,
    setFaqCategory,
    faqSearch,
    setFaqSearch,
    error,
    actionLoading,
    reloadArticles: loadArticles,
    reloadFaqs: loadFaqs,
    handleSaveArticle,
    handleRemoveArticle,
    handleSaveFaq,
    handleRemoveFaq,
  };
};
