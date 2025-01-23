import React from 'react';
import { Metadata } from 'next';
import { sanityFetch } from '../../../sanity/lib/sanityClient';
import BlogPageClient from './BlogPageClient';
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
    "tags": coalesce(tags[]->name, []),
    slug
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
}`;

// Type guard to ensure string type
function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

async function fetchBlogData(): Promise<BlogData> {
  try {
    const data = (await sanityFetch(POSTS_QUERY)) as {
      posts: (BlogPost & {
        categories: string[];
        tags: string[];
      })[];
      allCategories: { _id: string; title: string }[];
      allTags: { _id: string; name: string; _createdAt: string }[];
    };

    // Get unique categories from posts
    const categoriesFromPosts = Array.from(
      new Set(data.posts.flatMap((post) => post.categories ?? []).filter(isValidString))
    );

    // Get unique tags from posts
    const tagsFromPosts = Array.from(
      new Set(data.posts.flatMap((post) => post.tags ?? []).filter(isValidString))
    );

    // Process posts: remove null or empty categories and tags
    const processedPosts = data.posts.map((post) => ({
      ...post,
      categories: (post.categories ?? []).filter(isValidString),
      tags: (post.tags ?? []).filter(isValidString),
    })) as BlogPost[];

    // Use categories and tags from posts if the queries are empty
    const uniqueCategories =
      data.allCategories.length > 0
        ? data.allCategories.map((cat) => cat.title).filter(isValidString)
        : categoriesFromPosts;

    const uniqueTags =
      data.allTags.length > 0
        ? data.allTags.map((tag) => tag.name).filter(isValidString)
        : tagsFromPosts;

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

export default async function BlogPage() {
  const { posts, uniqueCategories, uniqueTags } = await fetchBlogData();

  return (
    <BlogPageClient posts={posts} uniqueCategories={uniqueCategories} uniqueTags={uniqueTags} />
  );
}
