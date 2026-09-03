import { IDailyTipRepository } from '../../domain/interfaces/repositories/IDailyTipRepository';
import { DailyTip, TipCategory } from '../../domain/entities/DailyTip';
import { DailyTipModel, IDailyTipDocument } from '../../framework/database/models/DailyTipModel';

export class DailyTipRepository implements IDailyTipRepository {
  private mapDocumentToEntity(doc: IDailyTipDocument): DailyTip {
    return {
      id: doc._id.toString(),
      category: doc.category,
      title: doc.title,
      content: doc.content,
      actionableStep: doc.actionableStep,
      sourceOrTag: doc.sourceOrTag,
      createdAt: doc.createdAt,
    };
  }

  async getTodayTip(category?: TipCategory): Promise<DailyTip | null> {
    const query: any = {};
    if (category && category !== 'general') {
      query.category = category;
    }

    const tips = await DailyTipModel.find(query);
    if (!tips || tips.length === 0) {
      const fallback = await DailyTipModel.findOne();
      return fallback ? this.mapDocumentToEntity(fallback) : null;
    }

    // Deterministic selection based on day of year so the tip changes daily
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const selectedIndex = dayOfYear % tips.length;

    return this.mapDocumentToEntity(tips[selectedIndex]);
  }

  async getAllTips(): Promise<DailyTip[]> {
    const docs = await DailyTipModel.find();
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async seedTips(tips: Partial<DailyTip>[]): Promise<void> {
    await DailyTipModel.insertMany(tips);
  }
}
