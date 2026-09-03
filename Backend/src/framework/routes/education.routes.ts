import { Router } from 'express';
import { ArticleRepository } from '../../adapters/repositories/ArticleRepository';
import { FaqRepository } from '../../adapters/repositories/FaqRepository';
import { GetArticlesUseCase } from '../../useCases/education/GetArticlesUseCase';
import { GetArticleByIdUseCase } from '../../useCases/education/GetArticleByIdUseCase';
import { CreateArticleUseCase } from '../../useCases/education/CreateArticleUseCase';
import { UpdateArticleUseCase } from '../../useCases/education/UpdateArticleUseCase';
import { DeleteArticleUseCase } from '../../useCases/education/DeleteArticleUseCase';
import { GetFaqsUseCase } from '../../useCases/education/GetFaqsUseCase';
import { CreateFaqUseCase } from '../../useCases/education/CreateFaqUseCase';
import { UpdateFaqUseCase } from '../../useCases/education/UpdateFaqUseCase';
import { DeleteFaqUseCase } from '../../useCases/education/DeleteFaqUseCase';
import { EducationController } from '../../adapters/controllers/education/EducationController';
import { authenticateJwt, requireRole } from '../../adapters/middlewares/auth.middleware';

const router = Router();

// Instantiate Repositories
const articleRepository = new ArticleRepository();
const faqRepository = new FaqRepository();

// Instantiate Use Cases
const getArticlesUseCase = new GetArticlesUseCase(articleRepository);
const getArticleByIdUseCase = new GetArticleByIdUseCase(articleRepository);
const createArticleUseCase = new CreateArticleUseCase(articleRepository);
const updateArticleUseCase = new UpdateArticleUseCase(articleRepository);
const deleteArticleUseCase = new DeleteArticleUseCase(articleRepository);

const getFaqsUseCase = new GetFaqsUseCase(faqRepository);
const createFaqUseCase = new CreateFaqUseCase(faqRepository);
const updateFaqUseCase = new UpdateFaqUseCase(faqRepository);
const deleteFaqUseCase = new DeleteFaqUseCase(faqRepository);

// Instantiate Controller
const educationController = new EducationController(
  getArticlesUseCase,
  getArticleByIdUseCase,
  createArticleUseCase,
  updateArticleUseCase,
  deleteArticleUseCase,
  getFaqsUseCase,
  createFaqUseCase,
  updateFaqUseCase,
  deleteFaqUseCase
);

// Public Routes (Accessible by registered users & visitors)
router.get('/articles', educationController.getArticles);
router.get('/articles/:id', educationController.getArticleById);
router.get('/faqs', educationController.getFaqs);

// Protected Admin Routes (Require valid JWT and 'admin' role)
router.get('/admin/articles', authenticateJwt, requireRole('admin'), educationController.getAdminArticles);
router.post('/admin/articles', authenticateJwt, requireRole('admin'), educationController.createArticle);
router.put('/admin/articles/:id', authenticateJwt, requireRole('admin'), educationController.updateArticle);
router.delete('/admin/articles/:id', authenticateJwt, requireRole('admin'), educationController.deleteArticle);

router.get('/admin/faqs', authenticateJwt, requireRole('admin'), educationController.getAdminFaqs);
router.post('/admin/faqs', authenticateJwt, requireRole('admin'), educationController.createFaq);
router.put('/admin/faqs/:id', authenticateJwt, requireRole('admin'), educationController.updateFaq);
router.delete('/admin/faqs/:id', authenticateJwt, requireRole('admin'), educationController.deleteFaq);

export default router;
