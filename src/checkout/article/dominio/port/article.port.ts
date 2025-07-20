import { IArticleProduct } from '../entitie/article.entities';

export interface IArticleProductPort {
  createArticle(article: IArticleProduct): Promise<IArticleProduct>;
  getAllArticles(): Promise<IArticleProduct[]>;
  getArticleById(id: string): Promise<IArticleProduct | null>;
  updateArticle(
    id: string,
    article: Partial<IArticleProduct>,
  ): Promise<IArticleProduct | null>;
  deleteArticle(id: string): Promise<void>;
}
