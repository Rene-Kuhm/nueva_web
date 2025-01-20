import { motion } from 'framer-motion';
import { Tag, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from 'next-sanity';
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

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  perspective: 'published',
});

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
          "slug": slug.current
        } | order(publishedAt desc)`;

        const categoriesQuery = `*[_type == "category"]{title}`;

        const [fetchedPosts, fetchedCategories] = await Promise.all([
          client.fetch<Post[]>(postsQuery),
          client.fetch<{title: string}[]>(categoriesQuery)
        ]);

        setPosts(fetchedPosts);
        setCategories(fetchedCategories.map(cat => cat.title));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return selectedCategory
      ? posts.filter(post => post.category === selectedCategory)
      : posts;
  }, [posts, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-12">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white"
      >
        Professional Blog
      </motion.h1>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          onClick={() => setSelectedCategory(null)}
        >
          All Posts
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts found in this category.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {post.mainImage?.asset?.url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.mainImage.asset.url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <User className="mr-2 h-4 w-4" />
                  {post.author.name}
                  <Clock className="ml-4 mr-2 h-4 w-4" />
                  {post.readTime}
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
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
                    <Button variant="outline">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
