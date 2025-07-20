import { IArticleProduct } from '../dominio/entitie/article.entities';
import { IArticleProductPort } from '../dominio/port/article.port';

export class ArticleCaseUse {
  constructor(private readonly articlePort: IArticleProductPort) {}

  async createArticle(article: IArticleProduct): Promise<IArticleProduct> {
    return this.articlePort.createArticle(article);
  }

  async getAllArticles(): Promise<IArticleProduct[]> {
    return this.articlePort.getAllArticles();
  }

  async getArticleById(id: string): Promise<IArticleProduct | null> {
    return this.articlePort.getArticleById(id);
  }

  async updateArticle(
    id: string,
    article: Partial<IArticleProduct>,
  ): Promise<IArticleProduct | null> {
    return this.articlePort.updateArticle(id, article);
  }

  async deleteArticle(id: string): Promise<void> {
    return this.articlePort.deleteArticle(id);
  }
}
