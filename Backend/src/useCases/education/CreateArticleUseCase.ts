import { IArticleRepository } from '../../domain/interfaces/repositories/IArticleRepository';
import { Article } from '../../domain/entities/Article';

export class CreateArticleUseCase {
  constructor(private articleRepository: IArticleRepository) {}

  async execute(data: Partial<Article>): Promise<Article> {
    if (!data.title || !data.content || !data.category) {
      throw new Error('Title, content, and category are required fields for an article');
    }

    // Auto slug generation if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    }

    // Default read time calculation (~200 words per minute) if not set
    if (!data.readTimeMinutes) {
      const wordCount = data.content.split(/\s+/).length;
      data.readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));
    }

    // Ensure educational disclaimer for medical & disease prevention
    if (!data.medicalDisclaimer) {
      data.medicalDisclaimer =
        'This content is provided for general educational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.';
    }

    if (data.isPublished === undefined) {
      data.isPublished = true;
    }

    return this.articleRepository.create(data);
  }
}
