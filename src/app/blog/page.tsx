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

const POSTS_QUERY = `*[_type == "post"] {
  title,
  "excerpt": coalesce(description, "Sin descripción"),
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

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return posts.reduce((acc, post) => {
      const category = post.category || 'Sin categoría';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [posts]);

  // Derive sidebar categories from both fetched categories and post categories
  const sidebarCategories = useMemo(() => {
    // If Sanity categories are available, use them with counts
    if (categories.length > 0) {
      return categories.map(category => ({
        title: category.title,
        count: categoryCounts[category.title] || 0
      }));
    }
    
    // Fallback to generating categories from posts
    return Object.entries(categoryCounts).map(([title, count]) => ({
      title,
      count
    }));
  }, [categories, categoryCounts]);

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
          image: post.image || null,
        }));
  
        setPosts(processedPosts);
  
        // Fetch categories
        const fetchedCategories: Category[] = await client.fetch(CATEGORIES_QUERY);
        
        console.log('Fetched categories:', fetchedCategories);
        
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
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  // Filtered posts logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
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

      const matchesCategory = selectedCategory
        ? post.category === selectedCategory
        : true;

      const matchesTags = 
        selectedTags.length > 0
          ? selectedTags.every((tag) => safeTags.includes(tag))
          : true;

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [posts, debouncedQuery, selectedCategory, selectedTags]);

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    return [...new Set(posts.flatMap(post => post.tags))];
  }, [posts]);

  // Tag toggle handler
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <main className="min-h-screen pt-24">
      <section className="relative overflow-hidden bg-muted/50 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Blog & Recursos
          </h1>
          <div className="mx-auto max-w-3xl">
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Buscar artículos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Categorías</h3>
              <div className="space-y-2">
                {sidebarCategories.map(({ title, count }) => (
                  <button
                    key={title}
                    onClick={() => setSelectedCategory(title)}
                    className={cn(
                      "flex w-full justify-between rounded-lg px-4 py-2 text-left transition-colors",
                      selectedCategory === title 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    )}
                  >
                    <span>{title}</span>
                    <span className="text-sm opacity-70">({count})</span>
                  </button>
                ))}
                {selectedCategory && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedCategory(null)}
                    className="mt-2 w-full"
                  >
                    Limpiar filtro
                  </Button>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          {/* Blog Posts */}
          <div>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground mb-4">
                  No se encontraron artículos que coincidan con tu búsqueda.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={clearFilters} variant="outline">
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-lg border bg-background shadow-sm"
                  >
                    {post.image && (
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                    <div className="p-4">
                      <div className="mb-2 flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                        <Clock className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
                      <p className="mb-4 text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{post.category}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/blog/${post.slug}`)}
                        >
                          Leer más
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
