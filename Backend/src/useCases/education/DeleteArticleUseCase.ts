import { IArticleRepository } from '../../domain/interfaces/repositories/IArticleRepository';

export class DeleteArticleUseCase {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(id: string): Promise<boolean> {
    const existing = await this.articleRepository.findById(id);
    if (!existing) {
      throw new Error('Article not found');
    }
    return this.articleRepository.delete(id);
  }
}
