// Tipos comunes para la aplicación
export type GenericFunction<T = void> = (...args: unknown[]) => T;

export type GenericObject = Record<string, unknown>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string>;
}

// Tipos específicos para el FAQ
export interface FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

// Tipos para el blog
export interface Post {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishedAt: string;
  author?: Author;
  categories?: Category[];
}

export interface Author {
  name: string;
  bio?: string;
  image?: string;
}

export interface Category {
  name: string;
  slug: string;
  description?: string;
}
