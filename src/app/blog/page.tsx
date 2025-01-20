'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
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

  // Validate Sanity configuration
  const validateSanityConfig = () => {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;

    if (!projectId) {
      return 'Sanity Project ID is not configured';
    }

    if (!dataset) {
      return 'Sanity Dataset is not configured';
    }

    return null;
  };

  useEffect(() => {
    async function fetchPosts() {
      // Check configuration before fetching
      const configError = validateSanityConfig();
      if (configError) {
        setError(configError);
        setLoading(false);
        return;
      }

      try {
        const fetchedPosts = await sanityFetch<Post[]>(POSTS_QUERY);
        
        // Additional validation of fetched posts
        if (!fetchedPosts || fetchedPosts.length === 0) {
          setError('No blog posts found. Check your Sanity dataset.');
        } else {
          setPosts(fetchedPosts);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Detailed error fetching posts:', err);
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
      <p>Loading posts...</p>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 py-12 space-y-4">
      <p className="text-2xl">{error}</p>
      <div className="bg-gray-100 p-4 rounded-lg inline-block">
        <h3 className="font-bold mb-2">Troubleshooting Tips:</h3>
        <ul className="text-left list-disc list-inside">
          <li>Check your Sanity project configuration</li>
          <li>Verify environment variables</li>
          <li>Ensure blog posts exist in your dataset</li>
          <li>Check network connection</li>
        </ul>
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
