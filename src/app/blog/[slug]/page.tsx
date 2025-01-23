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
    then: <TResult1 = any, TResult2 = never>(
      onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ) => Promise<TResult1 | TResult2>;
    catch: <TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ) => Promise<TResult>;
    finally: (onfinally?: (() => void) | undefined | null) => Promise<any>;
    [Symbol.toStringTag]: string;
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
            {post.tags.map((tag: any) => (
              <span key={tag.slug} className="px-3 py-1 bg-gray-300 rounded-full text-sm">
                {tag.name}
              </span>
            ))}
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
  const post = await getPost(params.slug);
  return {
    title: post?.title || 'Post no encontrado',
    description: post?.excerpt || 'Detalles del post',
  };
}
