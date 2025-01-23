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
      author-> {
        name,
        image
      }
    }
  `,
    { slug }
  );
}

export default async function Post({ params }: { params: { slug: string } }) {
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
      <div className="flex items-center mb-8">
        {post.author.image && (
          <Image
            src={urlForImage(post.author.image).width(40).height(40).url() || '/placeholder.svg'}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full mr-4"
          />
        )}
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="prose max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
