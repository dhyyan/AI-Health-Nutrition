import { FaqFilterOptions, IFaqRepository } from '../../domain/interfaces/repositories/IFaqRepository';
import { Faq } from '../../domain/entities/Faq';

export class GetFaqsUseCase {
  constructor(private faqRepository: IFaqRepository) {}

  async execute(options?: FaqFilterOptions): Promise<Faq[]> {
    return this.faqRepository.findAll(options);
  }
}
