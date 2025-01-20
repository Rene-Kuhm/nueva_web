'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, User, AlertTriangle } from 'lucide-react';
import { sanityFetch } from '../../../sanity/lib/sanityClient';

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
  "description": coalesce(excerpt, "No description available"),
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
        // Validate configuration
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

        if (!projectId || !dataset) {
          throw new Error('Sanity configuration is incomplete');
        }

        // Fetch posts
        const fetchedPosts = await sanityFetch<Post[]>(POSTS_QUERY);
        
        // Validate fetched posts
        if (!fetchedPosts || fetchedPosts.length === 0) {
          setError('No blog posts found. Check your Sanity dataset.');
        } else {
          setPosts(fetchedPosts);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(
          err instanceof Error 
            ? `Failed to load blog posts: ${err.message}` 
            : 'Unknown error occurred while fetching blog posts'
        );
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-xl animate-pulse">Loading blog posts...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 py-12 space-y-6 max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500" size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Blog Loading Error</h2>
        <p className="text-lg mb-4">{error}</p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
          <h3 className="font-bold mb-2 text-gray-700">Troubleshooting Steps:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Verify Sanity project ID and dataset</li>
            <li>Check environment variables</li>
            <li>Ensure blog posts exist in your dataset</li>
            <li>Confirm network connectivity</li>
            <li>Check Sanity project permissions</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 text-gray-600">
        <p>Need help? Contact your site administrator with the error details.</p>
      </div>
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
