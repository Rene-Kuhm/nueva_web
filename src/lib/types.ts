export interface BlogPost {
  _id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  slug: { current: string };
}

export interface BlogData {
  posts: BlogPost[];
  uniqueCategories: string[];
  uniqueTags: string[];
}

export interface BlogClientProps {
  initialCategories: string[];
  initialTags: string[];
}
