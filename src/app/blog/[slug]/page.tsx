import Image from 'next/image';
import { sanityFetch } from '../../../../sanity/lib/sanityClient';
import { Clock, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Interfaz para el post detallado

interface SanityBlock {
  _type: 'block';
  children: Array<{
    text: string;
    _type: string;
    marks?: string[];
  }>;
  style?: string;
  markDefs?: Array<{
    _type: string;
    _key: string;
  }>;
}

interface PostDetail {
  _id: string;
  title: string;
  body: SanityBlock[];
  description: string;
  author: {
    name: string;
    bio?: string;
    image?: {
      asset: {
        url: string;
      };
    };
  };
  publishedAt: string;
  mainImage?: {
    asset: {
      url: string;
    };
  };
  categories: Array<{
    title: string;
  }>;
}

// Función para convertir bloques de Sanity a texto
function blocksToText(blocks: SanityBlock[]): string {
  return blocks
    .map((block) => {
      if (block._type === 'block' && block.children) {
        return block.children.map((child) => child.text).join(' ');
      }
      return '';
    })
    .join('\n\n');
}

// For Image component usage:
const imageUrl = (url: string) => {
  return url.startsWith('http') ? url : `https://cdn.sanity.io/${url}`;
};

// Consulta para obtener el post por slug
function getPostQuery(slug: string) {
  return `*[_type == "post" && slug.current == "${slug}"][0] {
    _id,
    title,
    body,
    "description": coalesce(excerpt, "No description available"),
    "author": author->{
      name,
      bio,
      "image": image.asset->url
    },
    publishedAt,
    "mainImage": mainImage.asset->url,
    "categories": categories[]->{title}
  }`;
}



export default async function BlogPostDetail({ params }: { params: { slug: string } }) {
  try {
    const post = await sanityFetch<PostDetail>(getPostQuery(params.slug));

    if (!post) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl text-red-500">Publicación no encontrada</h1>
          <Link href="/blog" className="text-blue-500 hover:underline mt-4 inline-block">
            Volver al blog
          </Link>
        </div>
      );
    }

    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Link href="/blog" className="flex items-center text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="mr-2" /> Volver al blog
        </Link>

        {post.mainImage && (
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={imageUrl(post.mainImage?.asset.url || '')}
              alt={post.title}
              width={800}
              height={400}
              priority
            />
          </div>
        )}

        <article>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

          <div className="flex items-center space-x-4 mb-8 text-gray-600">
            <div className="flex items-center">
              <User className="mr-2" size={20} />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" size={20} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="flex items-center mb-8">
              <Tag className="mr-2 text-gray-500" size={20} />
              <div className="flex space-x-2">
                {post.categories.map((category) => (
                  <span
                    key={category.title}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="prose lg:prose-xl max-w-none text-gray-800">
            {blocksToText(post.body)}
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error('Error al cargar el post:', error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-red-500">Error al cargar la publicación</h1>
        <Link href="/blog" className="text-blue-500 hover:underline mt-4 inline-block">
          Volver al blog
        </Link>
      </div>
    );
  }
}
