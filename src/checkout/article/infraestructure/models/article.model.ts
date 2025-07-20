import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IArticleProduct } from '../../dominio/entitie/article.entities';

@Entity('article')
export class ArticleModel implements IArticleProduct {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  originalPrice?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'jsonb', nullable: true })
  images?: string[];

  @Column({ type: 'jsonb' })
  rating: {
    rate: number;
    count: number;
  };

  @Column({ type: 'varchar', length: 100 })
  badge: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount?: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: true })
  inStock: boolean;

  @Column({ type: 'boolean', default: false })
  featured?: boolean;
}
