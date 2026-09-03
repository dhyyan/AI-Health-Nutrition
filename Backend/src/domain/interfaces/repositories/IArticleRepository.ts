import { Article, ArticleCategory } from '../../entities/Article';

export interface ArticleFilterOptions {
  category?: ArticleCategory;
  search?: string;
  isPublishedOnly?: boolean;
  limit?: number;
}

export interface IArticleRepository {
  create(article: Partial<Article>): Promise<Article>;
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  findAll(options?: ArticleFilterOptions): Promise<Article[]>;
  update(id: string, article: Partial<Article>): Promise<Article | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
