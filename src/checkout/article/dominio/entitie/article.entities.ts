export interface IArticleProduct {
  id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  rating: {
    rate: number;
    count: number;
  };
  badge: string;
  discount?: number;
  stock: number;
  inStock?: boolean;
  featured?: boolean;
}

export type IArticleRating = {
  SALE: 'sale';
  NEW: 'new';
  FEATURED: 'featured';
};
