import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, Tag } from 'lucide-react';
import { sanityFetch } from '../../../sanity/lib/sanityClient';

// Interfaz de Post actualizada
interface Post {
  _id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  image?: string;
  tags: string[];
  slug: {
    current: string;
  };
}

// Consulta actualizada para incluir slug
const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "description": coalesce(excerpt, "No description available"),
  "author": author->name,
  publishedAt,
  "image": mainImage.asset->url,
  "tags": categories[]->title,
  slug
}[0...10]`;

// Loading component
function BlogPostsSkeleton() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-xl animate-pulse">Cargando publicaciones...</p>
      </div>
    </div>
  );
}

// Async Server Component for fetching blog posts
async function BlogPosts() {
  try {
    // Validate configuration
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

    if (!projectId || !dataset) {
      return <div className="text-red-500">Configuración de Sanity incompleta</div>;
    }

    // Fetch posts
    try {
      const posts = await sanityFetch<Post[]>(POSTS_QUERY);
      
      // Validate fetched posts
      if (!posts || posts.length === 0) {
        return <div className="text-yellow-500 text-center py-10">No se encontraron publicaciones</div>;
      }

      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Publicaciones del Blog</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post._id} 
                href={`/blog/${post.slug.current}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  {post.image && (
                    <div className="relative w-full h-56">
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:opacity-80 transition-opacity"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="mr-2" size={16} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2" size={16} />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <Tag className="mr-2" size={16} />
                        <div className="flex space-x-2">
                          {post.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="bg-gray-100 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    } catch (fetchError) {
      console.error('Error al cargar publicaciones:', fetchError);
      return <div className="text-red-500 text-center py-10">No se pudieron cargar las publicaciones</div>;
    }
  } catch (err) {
    console.error('Error inesperado:', err);
    return <div className="text-red-500 text-center py-10">Ocurrió un error inesperado</div>;
  }
}

// Main Page Component
export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPostsSkeleton />}>
      <BlogPosts />
    </Suspense>
  );
}
