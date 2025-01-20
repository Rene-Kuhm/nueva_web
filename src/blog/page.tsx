'use client';

import { motion } from 'framer-motion';
import { Search, Tag, Clock, User, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Desarrollo Web', count: 12 },
  { name: 'React', count: 8 },
  { name: 'TypeScript', count: 6 },
  { name: 'Next.js', count: 5 },
  { name: 'UI/UX', count: 4 },
];

const posts = [
  {
    title: 'Construyendo APIs Modernas con Next.js',
    excerpt: 'Aprende a crear APIs robustas y escalables utilizando las últimas características de Next.js y TypeScript.',
    content: 'En este artículo exploraremos cómo crear APIs modernas utilizando Next.js y TypeScript. Cubriremos temas como la validación de datos, el manejo de errores, la autenticación y la documentación automática de la API.',
    category: 'Next.js',
    author: 'René Kuhm',
    date: '17 Enero 2024',
    readTime: '5 min',
    image: '/blog/api-nextjs.jpg',
    tags: ['Next.js', 'API', 'TypeScript'],
  },
  {
    title: 'Optimización de Rendimiento en React',
    excerpt: 'Técnicas avanzadas para mejorar el rendimiento de tus aplicaciones React y ofrecer una mejor experiencia de usuario.',
    content: 'Descubre las mejores prácticas para optimizar el rendimiento de tus aplicaciones React. Aprenderás sobre memoización, lazy loading, code splitting y cómo usar las React DevTools para identificar y resolver problemas de rendimiento.',
    category: 'React',
    author: 'René Kuhm',
    date: '15 Enero 2024',
    readTime: '7 min',
    image: '/blog/react-performance.jpg',
    tags: ['React', 'Performance', 'Optimization'],
  },
  {
    title: 'Diseño de Interfaces Modernas',
    excerpt: 'Principios de diseño y mejores prácticas para crear interfaces de usuario atractivas y funcionales.',
    content: 'Explora los principios fundamentales del diseño de interfaces modernas. Desde la teoría del color hasta la tipografía, la jerarquía visual y la accesibilidad, aprenderás todo lo necesario para crear interfaces efectivas.',
    category: 'UI/UX',
    author: 'René Kuhm',
    date: '12 Enero 2024',
    readTime: '6 min',
    image: '/blog/modern-ui.jpg',
    tags: ['UI', 'Design', 'UX'],
  },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

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
      const matchesSearch = debouncedQuery
        ? post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
        : true;

      const matchesCategory = selectedCategory
        ? post.category === selectedCategory
        : true;

      const matchesTags =
        selectedTags.length > 0
          ? selectedTags.every((tag) => post.tags.includes(tag))
          : true;

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [debouncedQuery, selectedCategory, selectedTags]);

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    return Array.from(new Set(posts.flatMap((post) => post.tags)));
  }, []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  return (
    <main className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/50 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Blog & Recursos
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Explora nuestros artículos sobre desarrollo web, tecnología y mejores prácticas
          </p>
          <div className="mx-auto flex max-w-md items-center space-x-2">
            <Input
              placeholder="Buscar artículos..."
              className="h-12"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              size="icon"
              className="h-12 w-12"
              onClick={clearFilters}
              variant={searchQuery || selectedCategory || selectedTags.length > 0 ? "destructive" : "default"}
            >
              {searchQuery || selectedCategory || selectedTags.length > 0 ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
          {/* Active filters */}
          {(selectedCategory || selectedTags.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center gap-2"
            >
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center space-x-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  <span>{selectedCategory}</span>
                  <X className="h-3 w-3" />
                </button>
              )}
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className="inline-flex items-center space-x-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  <span>{tag}</span>
                  <X className="h-3 w-3" />
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
        {/* Decorative elements */}
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg border bg-card p-6"
            >
              <h2 className="mb-4 text-lg font-semibold">Categorías</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.name ? null : category.name
                    )}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                      selectedCategory === category.name && "bg-primary/10 text-primary"
                    )}
                  >
                    <span>{category.name}</span>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      selectedCategory === category.name
                        ? "bg-primary/20"
                        : "bg-primary/10 text-primary"
                    )}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

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
                      "inline-flex items-center space-x-1 rounded-full px-3 py-1 text-sm transition-colors",
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
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
                    <div className="aspect-video overflow-hidden bg-muted md:aspect-auto">
                      <div className="h-full bg-muted" />
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
                      <p className="mb-4 line-clamp-2 text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs",
                              selectedTags.includes(tag)
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <Button variant="link" className="group/link p-0">
                        Leer más{' '}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-lg text-muted-foreground">
                  No se encontraron artículos que coincidan con tu búsqueda.
                </p>
                <Button
                  onClick={clearFilters}
                  variant="link"
                  className="mt-4"
                >
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
