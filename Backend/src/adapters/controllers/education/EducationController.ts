import { Request, Response } from 'express';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { GetArticlesUseCase } from '../../../useCases/education/GetArticlesUseCase';
import { GetArticleByIdUseCase } from '../../../useCases/education/GetArticleByIdUseCase';
import { CreateArticleUseCase } from '../../../useCases/education/CreateArticleUseCase';
import { UpdateArticleUseCase } from '../../../useCases/education/UpdateArticleUseCase';
import { DeleteArticleUseCase } from '../../../useCases/education/DeleteArticleUseCase';
import { GetFaqsUseCase } from '../../../useCases/education/GetFaqsUseCase';
import { CreateFaqUseCase } from '../../../useCases/education/CreateFaqUseCase';
import { UpdateFaqUseCase } from '../../../useCases/education/UpdateFaqUseCase';
import { DeleteFaqUseCase } from '../../../useCases/education/DeleteFaqUseCase';
import { ArticleCategory } from '../../../domain/entities/Article';
import { FaqCategory } from '../../../domain/entities/Faq';

export class EducationController {
  constructor(
    private getArticlesUseCase: GetArticlesUseCase,
    private getArticleByIdUseCase: GetArticleByIdUseCase,
    private createArticleUseCase: CreateArticleUseCase,
    private updateArticleUseCase: UpdateArticleUseCase,
    private deleteArticleUseCase: DeleteArticleUseCase,
    private getFaqsUseCase: GetFaqsUseCase,
    private createFaqUseCase: CreateFaqUseCase,
    private updateFaqUseCase: UpdateFaqUseCase,
    private deleteFaqUseCase: DeleteFaqUseCase
  ) {}

  public getArticles = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { category, search, isPublishedOnly } = req.query;
      const articles = await this.getArticlesUseCase.execute({
        category: category as ArticleCategory,
        search: search as string,
        isPublishedOnly: isPublishedOnly !== 'false', // Defaults to true for public
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Articles retrieved successfully',
        data: articles,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to retrieve articles',
      });
    }
  };

  public getAdminArticles = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { category, search } = req.query;
      const articles = await this.getArticlesUseCase.execute({
        category: category as ArticleCategory,
        search: search as string,
        isPublishedOnly: false, // Admin views draft & published
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Admin articles list retrieved successfully',
        data: articles,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to retrieve articles',
      });
    }
  };

  public getArticleById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const article = await this.getArticleByIdUseCase.execute(id);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'Article details retrieved successfully',
        data: article,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message: error.message || 'Article not found',
      });
    }
  };

  public createArticle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const article = await this.createArticleUseCase.execute(req.body);
      return sendResponse({
        res,
        statusCode: 201,
        message: 'Educational article created successfully',
        data: article,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to create article',
      });
    }
  };

  public updateArticle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const article = await this.updateArticleUseCase.execute(id, req.body);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'Article updated successfully',
        data: article,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to update article',
      });
    }
  };

  public deleteArticle = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await this.deleteArticleUseCase.execute(id);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'Article deleted successfully',
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to delete article',
      });
    }
  };

  public getFaqs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { category, search } = req.query;
      const faqs = await this.getFaqsUseCase.execute({
        category: category as FaqCategory,
        search: search as string,
        isPublishedOnly: true,
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: 'FAQs retrieved successfully',
        data: faqs,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to retrieve FAQs',
      });
    }
  };

  public getAdminFaqs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { category, search } = req.query;
      const faqs = await this.getFaqsUseCase.execute({
        category: category as FaqCategory,
        search: search as string,
        isPublishedOnly: false, // Admin includes draft/unpublished
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Admin FAQs list retrieved successfully',
        data: faqs,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to retrieve FAQs',
      });
    }
  };

  public createFaq = async (req: Request, res: Response): Promise<Response> => {
    try {
      const faq = await this.createFaqUseCase.execute(req.body);
      return sendResponse({
        res,
        statusCode: 201,
        message: 'FAQ entry created successfully',
        data: faq,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to create FAQ entry',
      });
    }
  };

  public updateFaq = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const faq = await this.updateFaqUseCase.execute(id, req.body);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'FAQ entry updated successfully',
        data: faq,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to update FAQ entry',
      });
    }
  };

  public deleteFaq = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await this.deleteFaqUseCase.execute(id);
      return sendResponse({
        res,
        statusCode: 200,
        message: 'FAQ entry deleted successfully',
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: error.message || 'Failed to delete FAQ entry',
      });
    }
  };
}
