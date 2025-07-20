import { InjectRepository } from '@nestjs/typeorm';
import { IArticleProductPort } from '../../dominio/port/article.port';
import { ArticleModel } from '../models/article.model';
import { Repository } from 'typeorm';
import { IArticleProduct } from '../../dominio/entitie/article.entities';

export class ArticleRepository implements IArticleProductPort {
  constructor(
    @InjectRepository(ArticleModel)
    private readonly articleRepository: Repository<ArticleModel>,
  ) {}

  async createArticle(article: IArticleProduct): Promise<IArticleProduct> {
    const newArticle = this.articleRepository.create(article);
    return this.articleRepository.save(newArticle);
  }

  async getAllArticles(): Promise<IArticleProduct[]> {
    return this.articleRepository.find();
  }

  async getArticleById(id: string): Promise<IArticleProduct | null> {
    return this.articleRepository.findOne({ where: { id } });
  }

  async updateArticle(
    id: string,
    article: Partial<IArticleProduct>,
  ): Promise<IArticleProduct | null> {
    await this.articleRepository.update(id, article);
    return this.getArticleById(id);
  }

  async deleteArticle(id: string): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
