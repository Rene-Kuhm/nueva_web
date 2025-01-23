import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import { urlForImage } from '../../../sanity/lib/sanity.image';
import { sanityFetch } from '../../../sanity/lib/sanityClient';
import BlogClient from './BlogClient';
import BlogPosts from './BlogPosts';
import BlogPostsSkeleton from './BlogPostsSkeleton';
import { BlogPost, BlogData } from '../../lib/types';

// Metadata for the page
export const metadata: Metadata = {
  title: 'Blog | Nueva Web',
  description: 'Explora los últimos artículos y publicaciones de Nueva Web',
};

const POSTS_QUERY = `{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "description": coalesce(excerpt, "No description available"),
    "author": author->name,
    publishedAt,
    "image": mainImage.asset->url,
    "categories": coalesce(categories[]->title, []),
    "tags": coalesce(tags[]->title, []),
    slug
  }[0...10],
  "allCategories": *[_type == "category"] {
    _id,
    title
  } | order(title asc),
  "allTags": *[_type == "tag"] | order(_createdAt desc) {
    _id,
    title,
    _createdAt
  }
}`;

// Type guard to ensure string type
function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

async function fetchBlogData(): Promise<BlogData> {
  try {
    // Debug: Consulta específica para tags
    const debugTagsQuery = `*[_type == "tag"] {
      _id,
      title,
      _createdAt,
      "usedInPosts": count(*[_type == "post" && references(^._id)])
    }`;
    const debugTags = await sanityFetch(debugTagsQuery);
    console.log('Debug - Todos los tags en Sanity:', JSON.stringify(debugTags, null, 2));

    // Debug: Consulta específica para categorías
    const allCategoriesQuery = `*[_type == "category"] {
      _id,
      title,
      "usedInPosts": count(*[_type == "post" && references(^._id)])
    }`;
    const allCategories = await sanityFetch(allCategoriesQuery);
    console.log('Debug - Todas las categorías en Sanity:', JSON.stringify(allCategories, null, 2));

    const data = (await sanityFetch(POSTS_QUERY)) as {
      posts: (BlogPost & {
        categories: string[];
        tags: string[];
      })[];
      allCategories: { _id: string; title: string }[];
      allTags: { _id: string; title: string; _createdAt: string }[];
    };

    // Add debug logging to see the raw data
    console.log('Raw Sanity Data:', JSON.stringify(data, null, 2));

    // Get unique categories from posts since allCategories is empty
    const categoriesFromPosts = Array.from(
      new Set(data.posts.flatMap((post) => post.categories ?? []).filter(isValidString))
    );

    // Get unique tags from posts since allTags is empty
    const tagsFromPosts = Array.from(
      new Set(data.posts.flatMap((post) => post.tags ?? []).filter(isValidString))
    );

    // Procesar posts: eliminar categorías y tags nulos o vacíos
    const processedPosts = data.posts.map((post) => ({
      ...post,
      categories: (post.categories ?? []).filter(isValidString),
      tags: (post.tags ?? []).filter(isValidString),
    })) as BlogPost[];

    // Use categories and tags from posts if the allCategories/allTags queries are empty
    const uniqueCategories =
      data.allCategories.length > 0
        ? data.allCategories.map((cat) => cat.title).filter(isValidString)
        : categoriesFromPosts;

    const uniqueTags =
      data.allTags.length > 0
        ? data.allTags.map((tag) => tag.title).filter(isValidString)
        : tagsFromPosts;

    // Depuración
    console.log('Processed Posts:', JSON.stringify(processedPosts, null, 2));
    console.log('Unique Categories:', uniqueCategories);
    console.log('Unique Tags:', uniqueTags);

    return {
      posts: processedPosts,
      uniqueCategories,
      uniqueTags,
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      posts: [],
      uniqueCategories: [],
      uniqueTags: [],
    };
  }
}
export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { posts, uniqueCategories, uniqueTags } = await fetchBlogData();
  const searchTerm = searchParams?.search ?? '';
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <form action="/blog" method="get" className="mb-8">
          <input
            type="search"
            name="search"
            placeholder="Buscar en el blog..."
            defaultValue={typeof searchTerm === 'string' ? searchTerm : ''}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {posts.length > 0 && (
          <div className="mb-12">
            <a
              href={`/blog/${posts[0].slug.current}`}
              className="group block relative h-[400px] rounded-xl overflow-hidden shadow-lg"
            >
              {posts[0].image && (
                <Image
                  src={
                    urlForImage(posts[0].image).width(1200).height(600).url() || '/placeholder.svg'
                  }
                  alt={posts[0].title}
                  width={1200}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h1 className="text-4xl font-bold mb-4 group-hover:text-blue-300 transition-colors">
                    {posts[0].title}
                  </h1>
                  <p className="mb-4 line-clamp-2">{posts[0].description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{posts[0].author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(posts[0].publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <main className="lg:w-3/4">
            <Suspense fallback={<BlogPostsSkeleton />}>
              <BlogPosts
                initialPosts={posts.slice(1)}
                initialCategories={uniqueCategories}
                initialTags={uniqueTags}
              />
            </Suspense>
          </main>
          <aside className="lg:w-1/4">
            <BlogClient initialCategories={uniqueCategories} initialTags={uniqueTags} />
          </aside>
        </div>
      </div>
    </div>
  );
}
