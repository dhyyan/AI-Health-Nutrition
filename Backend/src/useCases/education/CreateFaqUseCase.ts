import { IFaqRepository } from '../../domain/interfaces/repositories/IFaqRepository';
import { Faq } from '../../domain/entities/Faq';

export class CreateFaqUseCase {
  constructor(private faqRepository: IFaqRepository) {}

  async execute(data: Partial<Faq>): Promise<Faq> {
    if (!data.question || !data.answer || !data.category) {
      throw new Error('Question, answer, and category are required for a FAQ entry');
    }

    if (data.isPublished === undefined) {
      data.isPublished = true;
    }

    if (data.order === undefined) {
      const currentCount = await this.faqRepository.count();
      data.order = currentCount + 1;
    }

    return this.faqRepository.create(data);
  }
}
