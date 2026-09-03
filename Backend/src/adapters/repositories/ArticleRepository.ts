import { ArticleFilterOptions, IArticleRepository } from '../../domain/interfaces/repositories/IArticleRepository';
import { Article } from '../../domain/entities/Article';
import { ArticleModel, IArticleDocument } from '../../framework/database/models/ArticleModel';

export class ArticleRepository implements IArticleRepository {
  private mapDocumentToEntity(doc: IArticleDocument): Article {
    return {
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      summary: doc.summary,
      content: doc.content,
      category: doc.category,
      readTimeMinutes: doc.readTimeMinutes,
      imageUrl: doc.imageUrl,
      tags: doc.tags || [],
      difficulty: doc.difficulty,
      exerciseSteps: doc.exerciseSteps || [],
      isPublished: doc.isPublished,
      isFeatured: doc.isFeatured,
      medicalDisclaimer: doc.medicalDisclaimer,
      createdBy: doc.createdBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(articleData: Partial<Article>): Promise<Article> {
    const created = await ArticleModel.create(articleData);
    return this.mapDocumentToEntity(created);
  }

  async findById(id: string): Promise<Article | null> {
    const doc = await ArticleModel.findById(id);
    return doc ? this.mapDocumentToEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const doc = await ArticleModel.findOne({ slug });
    return doc ? this.mapDocumentToEntity(doc) : null;
  }

  async findAll(options?: ArticleFilterOptions): Promise<Article[]> {
    const query: any = {};

    if (options?.category) {
      query.category = options.category;
    }

    if (options?.isPublishedOnly) {
      query.isPublished = true;
    }

    if (options?.search) {
      const searchRegex = new RegExp(options.search, 'i');
      query.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { tags: searchRegex },
      ];
    }

    let mongoQuery = ArticleModel.find(query).sort({ isFeatured: -1, createdAt: -1 });

    if (options?.limit && options.limit > 0) {
      mongoQuery = mongoQuery.limit(options.limit);
    }

    const docs = await mongoQuery.exec();
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async update(id: string, articleData: Partial<Article>): Promise<Article | null> {
    const updated = await ArticleModel.findByIdAndUpdate(
      id,
      { $set: articleData },
      { new: true, runValidators: true }
    );
    return updated ? this.mapDocumentToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await ArticleModel.findByIdAndDelete(id);
    return !!res;
  }

  async count(): Promise<number> {
    return ArticleModel.countDocuments();
  }
}
