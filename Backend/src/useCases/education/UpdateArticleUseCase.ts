import { IArticleRepository } from '../../domain/interfaces/repositories/IArticleRepository';
import { Article } from '../../domain/entities/Article';

export class UpdateArticleUseCase {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(id: string, data: Partial<Article>): Promise<Article> {
    const existing = await this.articleRepository.findById(id);
    if (!existing) {
      throw new Error('Article not found');
    }

    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    }

    if (data.content && !data.readTimeMinutes) {
      const wordCount = data.content.split(/\s+/).length;
      data.readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));
    }

    const updated = await this.articleRepository.update(id, data);
    if (!updated) {
      throw new Error('Failed to update article');
    }
    return updated;
  }
}
