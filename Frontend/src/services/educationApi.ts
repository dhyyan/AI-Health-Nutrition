import api from './api';
import {
  Article,
  Faq,
  ArticleFilterParams,
  FaqFilterParams,
  CreateArticleDTO,
  CreateFaqDTO,
} from '../types/education.types';

// Public User Endpoints
export const getPublicArticles = async (params?: ArticleFilterParams): Promise<Article[]> => {
  const response = await api.get('/education/articles', { params });
  return response.data.data;
};

export const getArticleDetails = async (id: string): Promise<Article> => {
  const response = await api.get(`/education/articles/${id}`);
  return response.data.data;
};

export const getPublicFaqs = async (params?: FaqFilterParams): Promise<Faq[]> => {
  const response = await api.get('/education/faqs', { params });
  return response.data.data;
};

// Admin Endpoints
export const getAdminArticles = async (params?: ArticleFilterParams): Promise<Article[]> => {
  const response = await api.get('/education/admin/articles', { params });
  return response.data.data;
};

export const createArticle = async (data: CreateArticleDTO): Promise<Article> => {
  const response = await api.post('/education/admin/articles', data);
  return response.data.data;
};

export const updateArticle = async (id: string, data: Partial<CreateArticleDTO>): Promise<Article> => {
  const response = await api.put(`/education/admin/articles/${id}`, data);
  return response.data.data;
};

export const deleteArticle = async (id: string): Promise<boolean> => {
  const response = await api.delete(`/education/admin/articles/${id}`);
  return response.data.success;
};

export const getAdminFaqs = async (params?: FaqFilterParams): Promise<Faq[]> => {
  const response = await api.get('/education/admin/faqs', { params });
  return response.data.data;
};

export const createFaq = async (data: CreateFaqDTO): Promise<Faq> => {
  const response = await api.post('/education/admin/faqs', data);
  return response.data.data;
};

export const updateFaq = async (id: string, data: Partial<CreateFaqDTO>): Promise<Faq> => {
  const response = await api.put(`/education/admin/faqs/${id}`, data);
  return response.data.data;
};

export const deleteFaq = async (id: string): Promise<boolean> => {
  const response = await api.delete(`/education/admin/faqs/${id}`);
  return response.data.success;
};
