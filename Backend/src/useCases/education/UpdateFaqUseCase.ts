import { IFaqRepository } from '../../domain/interfaces/repositories/IFaqRepository';
import { Faq } from '../../domain/entities/Faq';

export class UpdateFaqUseCase {
  constructor(private faqRepository: IFaqRepository) {}

  async execute(id: string, data: Partial<Faq>): Promise<Faq> {
    const existing = await this.faqRepository.findById(id);
    if (!existing) {
      throw new Error('FAQ entry not found');
    }

    const updated = await this.faqRepository.update(id, data);
    if (!updated) {
      throw new Error('Failed to update FAQ entry');
    }
    return updated;
  }
}
