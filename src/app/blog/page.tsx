'use client';

import { useState, useEffect } from 'react';
import { createClient } from 'next-sanity';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Simple Post interface
interface Post {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  image?: string;
  tags: string[];
}

// Simple query to fetch posts
const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  title,
  "description": excerpt,
  "author": author->name,
  publishedAt,
  "image": mainImage.asset->url,
  "tags": categories[]->title
}[0...10]`;

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await client.fetch<Post[]>(POSTS_QUERY);
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts');
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading posts...</p>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 py-12">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div 
            key={index} 
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            {post.image && (
              <div className="relative w-full h-48">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <User className="mr-2" size={16} />
                {post.author}
                <Clock className="ml-4 mr-2" size={16} />
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
