export type BlogPost = {
  _id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  slug: { current: string };
};

// Type guard to ensure blog post integrity
export function isValidBlogPost(post: BlogPost): boolean {
  return (
    typeof post._id === 'string' &&
    post._id.trim().length > 0 &&
    typeof post.title === 'string' &&
    post.title.trim().length > 0 &&
    post.slug?.current &&
    typeof post.slug.current === 'string' &&
    post.slug.current.trim().length > 0 &&
    typeof post.publishedAt === 'string' &&
    post.publishedAt.trim().length > 0
  );
}

// Optional: Create a function to sanitize blog posts
export function sanitizeBlogPost(post: Partial<BlogPost>): BlogPost | null {
  if (!isValidBlogPost(post as BlogPost)) {
    console.warn('Invalid blog post:', post);
    return null;
  }
  
  return {
    _id: post._id || '',
    title: post.title || '',
    description: post.description || '',
    author: post.author || 'Unknown',
    publishedAt: post.publishedAt || new Date().toISOString(),
    image: post.image || undefined,
    tags: post.tags || [],
    categories: post.categories || [],
    slug: post.slug || { current: '' }
  };
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
