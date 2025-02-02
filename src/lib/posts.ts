import { sanityFetch } from '../../sanity/lib/sanityClient';

// Define a type for the post
export interface Post {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  slug: { current: string };
  readTime: string;
  image?: {
    asset: {
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        }
      }
    }
  };
}

// Query for latest posts
const POSTS_QUERY = `{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "excerpt": coalesce(excerpt, "No description available"),
    "author": author->name,
    publishedAt,
    "tags": categories[]->title,
    slug,
    "readTime": "5 min",
    "image": mainImage {
      asset->{
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    }
  }[0...3]
}`;

export async function getPosts(): Promise<Post[]> {
  try {
    const result = await sanityFetch<{ posts: Post[] }>(POSTS_QUERY, {});
    return result?.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getAllTags(): Promise<string[]> {
  const TAGS_QUERY = `{
    "tags": *[_type == "post"].categories[]->title
  }`;

  try {
    const result = await sanityFetch<{ tags: string[] }>(TAGS_QUERY, {});
    return [...new Set(result?.tags || [])];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}
