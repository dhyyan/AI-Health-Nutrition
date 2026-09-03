import { IFaqRepository } from '../../domain/interfaces/repositories/IFaqRepository';

export class DeleteFaqUseCase {
  constructor(private faqRepository: IFaqRepository) {}

  async execute(id: string): Promise<boolean> {
    const existing = await this.faqRepository.findById(id);
    if (!existing) {
      throw new Error('FAQ entry not found');
    }
    return this.faqRepository.delete(id);
  }
}
