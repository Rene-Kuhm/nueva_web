'use client';

import { motion } from 'framer-motion';
import { Search, Tag, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { createClient } from 'next-sanity';
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
  image: string;
  tags: string[];
}

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
});

// Query to fetch blog posts
const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  title,
  "excerpt": description,
  content,
  "category": categories[0]->title,
  "author": author->name,
  publishedAt,
  "readTime": round(length(pt::text(body)) / 5 / 200) + " min",
  "image": mainImage.asset->url,
  "tags": categories[]->title
}`;

const categories = [
  { name: 'Desarrollo Web', count: 12 },
  { name: 'React', count: 8 },
  { name: 'TypeScript', count: 6 },
  { name: 'Next.js', count: 5 },
  { name: 'UI/UX', count: 4 },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts: Post[] = await client.fetch(POSTS_QUERY);
        setPosts(fetchedPosts.map(post => ({
          ...post,
          date: post.publishedAt, // Convert publishedAt to date
          tags: post.tags || [], // Ensure tags is always an array
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog de René Kuhm</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input 
              type="text" 
              placeholder="Buscar artículos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={selectedCategory === cat.name ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={cn(
                'flex items-center gap-2',
                selectedCategory === cat.name 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground'
              )}
            >
              <Tag size={16} />
              {cat.name} ({cat.count})
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p>Cargando artículos...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-8">
            <p>No se encontraron artículos.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {post.image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <User size={16} className="mr-2" />
                  {post.author}
                  <span className="mx-2">•</span>
                  <Clock size={16} className="mr-2" />
                  {post.date}
                </div>
                <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm">
                    Leer más
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
