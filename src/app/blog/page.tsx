import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { generatePageMetadata } from '../metadata';
import BlogPageClient from './BlogPageClient';
import { client } from '../../../sanity/lib/sanityClient';
import { groq } from 'next-sanity';
import { BlogPost as ImportedBlogPost, BlogData as ImportedBlogData } from '../../lib/types';
import { ErrorBoundary } from '@/components/error-boundary';
import { Loader2 } from 'lucide-react';

// Define the shape of the Sanity query result
interface SanityQueryResult {
  posts: Array<{
    _id: string;
    title: string;
    description?: string;
    slug: string;
    image?: string;
    author?: string;
    publishedAt: string;
    categories?: string[];
    tags?: string[];
  }>;
  allCategories: Array<{ _id: string; title: string }>;
  allTags: Array<{ _id: string; name: string; _createdAt: string }>;
}

// Definir la consulta GROQ para obtener posts
const POSTS_QUERY = groq`
  {
    "posts": *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "description": coalesce(excerpt, "No description available"),
      "slug": slug.current,
      "image": mainImage.asset->url,
      "author": author->name,
      publishedAt,
      "categories": categories[]->title,
      "tags": tags[]->name
    }[0...10],
    "allCategories": *[_type == "category"] {
      _id,
      title
    } | order(title asc),
    "allTags": *[_type == "tag"] | order(_createdAt desc) {
      _id,
      name,
      _createdAt
    }
  }
`;

// Exponential backoff function for retrying requests
async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>, 
  maxRetries = 3, 
  baseDelay = 1000
): Promise<T> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fetchFn();
    } catch (error) {
      retries++;
      
      // Log the error
      console.error(`Fetch attempt ${retries} failed:`, error);
      
      // If it's the last retry, throw the error
      if (retries === maxRetries) {
        throw error;
      }

      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, retries);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This line should never be reached due to the throw in the loop, 
  // but TypeScript requires a return
  throw new Error('Fetch failed after maximum retries');
}

// Función para obtener posts con manejo de errores
async function fetchBlogData(): Promise<ImportedBlogData> {
  try {
    const data = await fetchWithRetry<SanityQueryResult>(async () => {
      return await client.fetch(
        POSTS_QUERY,
        {},
        { 
          cache: 'force-cache',
          next: { 
            revalidate: 3600 // Revalidar cada hora
          }
        }
      );
    });

    // Sanitize and validate data
    const posts: ImportedBlogPost[] = (data.posts || []).map(post => ({
      _id: post._id || crypto.randomUUID(), // Fallback to random UUID if no ID
      title: post.title || 'Sin título',
      description: post.description || 'Sin descripción',
      slug: { current: post.slug || crypto.randomUUID() },
      image: post.image || '/placeholder.jpg',
      author: post.author || 'Autor desconocido',
      publishedAt: post.publishedAt || new Date().toISOString(),
      categories: post.categories || [],
      tags: post.tags || []
    }));

    const uniqueCategories = Array.from(
      new Set(posts.flatMap(post => post.categories || []))
    );

    const uniqueTags = Array.from(
      new Set(posts.flatMap(post => post.tags || []))
    );

    return {
      posts,
      uniqueCategories,
      uniqueTags
    };
  } catch (error) {
    console.error('Critical error fetching blog data:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return {
      posts: [],
      uniqueCategories: [],
      uniqueTags: []
    };
  }
}

// Componente de carga
function BlogLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );
}

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog | KuhmDev',
  description: 'Explora los últimos artículos y publicaciones de KuhmDev'
});

export default async function BlogPage() {
  const { posts, uniqueCategories, uniqueTags } = await fetchBlogData();

  return (
    <ErrorBoundary>
      <Suspense fallback={<BlogLoading />}>
        <BlogPageClient 
          posts={posts} 
          uniqueCategories={uniqueCategories} 
          uniqueTags={uniqueTags} 
        />
      </Suspense>
    </ErrorBoundary>
  );
}

// Habilitar regeneración estática incremental
export const revalidate = 3600; // Revalidar cada hora
