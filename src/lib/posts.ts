import { sanityFetch } from '../../sanity/lib/sanityClient';

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

export async function getPosts() {
  const { posts } = await sanityFetch(POSTS_QUERY, {});
  return posts;
}
