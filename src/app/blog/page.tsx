'use client';

import { motion } from 'framer-motion';
import { Tag, Clock, User, ArrowRight, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { client } from '../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';

// Enhanced type definitions
interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    image?: string;
  };
  publishedAt: string;
  readTime: string;
  mainImage?: {
    asset: {
      url: string;
    };
  };
  tags: string[];
  slug: {
    current: string;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const postsQuery = `*[_type == "post"] {
          _id,
          title,
          excerpt,
          "category": category->title,
          "author": author->{name, image},
          publishedAt,
          readTime,
          "mainImage": mainImage{
            asset->{url}
          },
          tags,
          "slug": slug.current,
          content
        } | order(publishedAt desc)`;

        const categoriesQuery = `*[_type == "category"]{title}`;

        const [fetchedPosts, fetchedCategories] = await Promise.all([
          client.fetch<Post[]>(postsQuery).catch(() => []),
          client.fetch<{title: string}[]>(categoriesQuery).catch(() => [])
        ]);

        setPosts(fetchedPosts);
        setCategories(fetchedCategories.map((cat) => cat.title));
        
        if (fetchedPosts.length === 0 || fetchedCategories.length === 0) {
          setError('Unable to fetch blog posts. Please try again later.');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please check your connection.');
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 dark:border-blue-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 dark:bg-red-900 min-h-screen flex flex-col justify-center">
        <p className="text-red-500 dark:text-red-300 text-xl mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mx-auto bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-center mb-12 text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
      >
        Professional Insights
      </motion.h1>

      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Search posts by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2 w-full border-2 border-blue-200 dark:border-blue-800 rounded-full focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchQuery && (
            <X
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
            />
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All Posts
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <p className="text-2xl mb-4">No posts found</p>
          <p>Try adjusting your search or category filter</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              {post.mainImage?.asset?.url && (
                <div className="relative h-56 w-full group">
                  <Image
                    src={post.mainImage.asset.url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <User className="mr-2 h-4 w-4" />
                  {post.author.name}
                  <Clock className="ml-4 mr-2 h-4 w-4" />
                  {post.readTime}
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug.current}`}>
                    <Button variant="outline" className="rounded-full">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredPosts.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            Showing {filteredPosts.length} of {posts.length} posts
          </p>
        </div>
      )}
    </div>
  );
}
