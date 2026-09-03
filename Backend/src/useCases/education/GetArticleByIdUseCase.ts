import { IArticleRepository } from '../../domain/interfaces/repositories/IArticleRepository';
import { Article } from '../../domain/entities/Article';

export class GetArticleByIdUseCase {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(id: string): Promise<Article> {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }
}
