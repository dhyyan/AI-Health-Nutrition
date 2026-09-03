import { FaqFilterOptions, IFaqRepository } from '../../domain/interfaces/repositories/IFaqRepository';
import { Faq } from '../../domain/entities/Faq';
import { FaqModel, IFaqDocument } from '../../framework/database/models/FaqModel';

export class FaqRepository implements IFaqRepository {
  private mapDocumentToEntity(doc: IFaqDocument): Faq {
    return {
      id: doc._id.toString(),
      question: doc.question,
      answer: doc.answer,
      category: doc.category,
      order: doc.order,
      isPublished: doc.isPublished,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(faqData: Partial<Faq>): Promise<Faq> {
    const created = await FaqModel.create(faqData);
    return this.mapDocumentToEntity(created);
  }

  async findById(id: string): Promise<Faq | null> {
    const doc = await FaqModel.findById(id);
    return doc ? this.mapDocumentToEntity(doc) : null;
  }

  async findAll(options?: FaqFilterOptions): Promise<Faq[]> {
    const query: any = {};

    if (options?.category) {
      query.category = options.category;
    }

    if (options?.isPublishedOnly) {
      query.isPublished = true;
    }

    if (options?.search) {
      const searchRegex = new RegExp(options.search, 'i');
      query.$or = [{ question: searchRegex }, { answer: searchRegex }];
    }

    const docs = await FaqModel.find(query).sort({ order: 1, createdAt: 1 });
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async update(id: string, faqData: Partial<Faq>): Promise<Faq | null> {
    const updated = await FaqModel.findByIdAndUpdate(
      id,
      { $set: faqData },
      { new: true, runValidators: true }
    );
    return updated ? this.mapDocumentToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await FaqModel.findByIdAndDelete(id);
    return !!res;
  }

  async count(): Promise<number> {
    return FaqModel.countDocuments();
  }
}
