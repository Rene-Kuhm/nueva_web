import { sanityFetch } from '../../../sanity/lib/sanityClient';
import { urlForImage } from '../../../sanity/lib/sanity.image';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';

// Consulta para obtener posts y tags
const POSTS_QUERY = `{
  "posts": *[_type == "post" &&
    (
      $searchTerm == "" ||
      title match $searchTerm ||
      description match $searchTerm ||
      author->name match $searchTerm
    )
  ] | order(publishedAt desc) {
    _id,
    title,
    "description": coalesce(excerpt, "No description available"),
    "author": author->name,
    publishedAt,
    "image": mainImage.asset->url,
    "tags": categories[]->title,
    slug
  }[0...10],
  "allTags": *[_type == "category"].title
}`;

export async function fetchBlogData(searchTerm = '') {
  const { posts, allTags } = await sanityFetch(POSTS_QUERY, { searchTerm });
  const uniqueTags = [...new Set(allTags || [])];

  return { posts, uniqueTags };
}

export function BlogPosts({ posts }) {
  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <a key={post._id} href={`/blog/${post.slug.current}`} className="group">
            <article className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              {post.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={urlForImage(post.image).width(400).height(250).url() || '/placeholder.svg'}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                  </div>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex space-x-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-500 text-blue-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </a>
        ))}
      </div>
    </div>
  );
}

export function BlogPostsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-gray-100 animate-pulse rounded-lg overflow-hidden shadow-md"
          >
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 mb-2 w-full"></div>
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-300 w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
