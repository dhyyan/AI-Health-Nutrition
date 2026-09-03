import { ArticleFilterOptions, IArticleRepository } from '../../domain/interfaces/repositories/IArticleRepository';
import { Article } from '../../domain/entities/Article';

export class GetArticlesUseCase {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(options?: ArticleFilterOptions): Promise<Article[]> {
    return this.articleRepository.findAll(options);
  }
}
