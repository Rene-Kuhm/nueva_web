import { Metadata } from 'next';
import { client } from '../../../../sanity/lib/sanityClient';
import { urlForImage } from '../../../../sanity/lib/sanity.image';
import PortableText from '../../../../components/PortableText';
import Image from 'next/image';

async function getPost(slug: string) {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      slug,
      mainImage,
      body,
      publishedAt,
      "tags": tags[]-> {
        name,
        slug
      },
      author-> {
        name,
        image
      }
    }
  `,
    { slug }
  );
}

type Props = {
  params: {
    slug: string;
  };
};

// @ts-ignore - Next.js type mismatch
export default async function Page({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) return <div>Post no encontrado</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.mainImage && (
        <Image
          src={urlForImage(post.mainImage).width(1000).height(500).url() || '/placeholder.svg'}
          alt={post.title}
          width={1000}
          height={500}
          className="w-full h-auto mb-6 rounded-lg"
        />
      )}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center">
          {post.author.image && (
            <Image
              src={urlForImage(post.author.image).width(40).height(40).url() || '/placeholder.svg'}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full mr-4"
            />
          )}
          <p className="text-sm">{post.author.name}</p>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: any, index: number) => {
              // Generate a unique key using multiple attributes
              const uniqueTagKey = `${tag.slug || 'unknown-tag'}-${index}-${post.slug?.current || 'no-slug'}`;

              return (
                <span
                  key={uniqueTagKey}
                  className="px-3 py-1 bg-blue-400 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <div className="prose max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}

// @ts-ignore - Next.js type mismatch
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Ensure params.slug is properly awaited
  const slug = await (async () => {
    // Check if params.slug is a Promise using type guard
    if (typeof params.slug !== 'string') {
      return await params.slug;
    }
    // If it's already a string, return it
    return params.slug;
  })();

  const post = await getPost(slug);
  return {
    title: post?.title || 'Post no encontrado',
    description: post?.excerpt || 'Detalles del post',
    openGraph: post ? {
      title: post.title,
      description: post.excerpt,
      images: post.mainImage ? [{
        url: urlForImage(post.mainImage).url() || '',
        width: 800,
        height: 600,
      }] : [],
    } : {},
  };
}
