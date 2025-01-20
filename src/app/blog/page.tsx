'use client';

import { motion } from 'framer-motion';
import { Tag, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { createClient } from 'next-sanity';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Define Post type for type safety
interface Post {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  publishedAt: string;
  readTime: string;
  image: string | null;
  tags: string[];
  slug: string;
}

// Define Category type
interface Category {
  _id: string;
  title: string;
  description?: string;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  useCdn: false, // Disable CDN to avoid caching issues
  perspective: 'published',
  token: process.env.SANITY_API_TOKEN, // Optional: add API token if available
});

const POSTS_QUERY = `*[_type == "post" && defined(slug)] | order(publishedAt desc) {
  title,
  "excerpt": coalesce(description, ""),
  "content": pt::text(body),
  "category": categories[0]->title,
  "author": author->name,
  publishedAt,
  "readTime": round(length(pt::text(body)) / 5 / 200) + " min",
  "image": mainImage.asset->url,
  "tags": categories[]->title,
  "slug": slug.current
}`;

const CATEGORIES_QUERY = `*[_type == "category" && defined(title)] {
  _id,
  title,
  description
}`;

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Fetch posts and categories from Sanity
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch posts with additional error checking
        const fetchedPosts: Post[] = await client.fetch(POSTS_QUERY);

        if (!fetchedPosts || fetchedPosts.length === 0) {
          console.warn('No posts found');
          setPosts([]);
          return;
        }

        const processedPosts = fetchedPosts.map((post) => ({
          ...post,
          date: post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : 'Fecha no disponible',
          tags: post.tags || [],
          category: post.category || 'Sin categoría',
          // Ensure image is a valid URL or null
          image: post.image || null,
        }));

        setPosts(processedPosts);

        // Fetch categories
        const fetchedCategories: Category[] = await client.fetch(CATEGORIES_QUERY);

        if (!fetchedCategories || fetchedCategories.length === 0) {
          console.warn('No categories found');
          setCategories([]);
          return;
        }

        setCategories(fetchedCategories);
      } catch (error: unknown) {
        // Comprehensive error handling
        if (error instanceof Error) {
          console.error('Detailed Sanity fetch error:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
        } else {
          console.error('Unknown error during Sanity data fetch', error);
        }

        // Fallback to empty states
        setPosts([]);
        setCategories([]);
      }
    }

    fetchData();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter posts based on search query, category, and tags
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Ensure all string comparisons are safe
      const safeTitle = post.title?.toLowerCase() || '';
      const safeContent = post.content?.toLowerCase() || '';
      const safeExcerpt = post.excerpt?.toLowerCase() || '';
      const safeTags = post.tags || [];
      const safeQuery = debouncedQuery.toLowerCase();

      const matchesSearch = safeQuery
        ? safeTitle.includes(safeQuery) ||
          safeContent.includes(safeQuery) ||
          safeExcerpt.includes(safeQuery) ||
          safeTags.some((tag) => tag.toLowerCase().includes(safeQuery))
        : true;

      const matchesCategory = selectedCategory ? post.category === selectedCategory : true;

      const matchesTags =
        selectedTags.length > 0 ? selectedTags.every((tag) => safeTags.includes(tag)) : true;

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [posts, debouncedQuery, selectedCategory, selectedTags]);

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    return Array.from(new Set(posts.flatMap((post: Post) => post.tags)));
  }, [posts]);

  // Count posts per category
  const categoryCounts = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        const category = post.category || 'Sin categoría';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [posts]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  // Navigate to blog post
  const navigateToBlogPost = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  return (
    <main className="min-h-screen pt-24">
      {/* Rest of the component remains the same */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Categories section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg border bg-card p-6"
            >
              <h2 className="mb-4 text-lg font-semibold">Categorías</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.title ? null : category.title
                      )
                    }
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
                      selectedCategory === category.title && 'bg-primary/10 text-primary'
                    )}
                  >
                    <span>{category.title}</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs',
                        selectedCategory === category.title
                          ? 'bg-primary/20'
                          : 'bg-primary/10 text-primary'
                      )}
                    >
                      {categoryCounts[category.title] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tags section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border bg-card p-6"
            >
              <h2 className="mb-4 text-lg font-semibold">Tags Populares</h2>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      'inline-flex items-center space-x-1 rounded-full px-3 py-1 text-sm transition-colors',
                      selectedTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    )}
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </aside>

          {/* Main Content */}
          <div className="space-y-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
                >
                  <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
                    <div className="aspect-video overflow-hidden bg-muted md:aspect-auto relative">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-full bg-muted flex items-center justify-center text-muted-foreground">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </span>
                        <span className="inline-flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <h2 className="mb-2 text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>
                      <p className="mb-4 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-xs',
                              selectedTags.includes(tag)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="link"
                        className="group/link p-0"
                        onClick={() => navigateToBlogPost(post.slug)}
                      >
                        Leer más{' '}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="text-lg text-muted-foreground">
                  No se encontraron artículos que coincidan con tu búsqueda.
                </p>
                <Button onClick={clearFilters} variant="link" className="mt-4">
                  Limpiar filtros
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
