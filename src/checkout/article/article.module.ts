import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModel } from './infraestructure/models/article.model';
import { ArticleController } from './infraestructure/controller/article.controller';
import { ArticleRepository } from './infraestructure/repository/article.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleModel])],
  controllers: [ArticleController],
  providers: [ArticleRepository],
  exports: [ArticleRepository],
})
export class ArticlesModule {}
