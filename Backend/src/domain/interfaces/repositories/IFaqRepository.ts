import { Faq, FaqCategory } from '../../entities/Faq';

export interface FaqFilterOptions {
  category?: FaqCategory;
  search?: string;
  isPublishedOnly?: boolean;
}

export interface IFaqRepository {
  create(faq: Partial<Faq>): Promise<Faq>;
  findById(id: string): Promise<Faq | null>;
  findAll(options?: FaqFilterOptions): Promise<Faq[]>;
  update(id: string, faq: Partial<Faq>): Promise<Faq | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
