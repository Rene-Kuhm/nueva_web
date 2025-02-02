import { sanityFetch } from '../../../sanity/lib/sanityClient';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Timer, Users } from 'lucide-react';

// Query for latest posts
const LATEST_POSTS_QUERY = `{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "excerpt": coalesce(excerpt, "No description available"),
    "author": author->name,
    publishedAt,
    "image": mainImage.asset->url,
    "tags": categories[]->title,
    slug,
    "readTime": "5 min"
  }[0...3]
}`;

async function getLatestPosts() {
  const { posts } = await sanityFetch(LATEST_POSTS_QUERY, {});
  return posts;
}

export async function LatestPosts() {
  const posts = await getLatestPosts();

  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Últimas Publicaciones
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
            Explora nuestros artículos más recientes sobre desarrollo web, tecnología y mejores
            prácticas
          </p>
        </motion.div>

        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{post.author}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <Timer className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags && post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="group/link inline-flex items-center text-sm font-medium text-primary"
                >
                  Leer más{' '}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" className="gap-2">
              Ver todas las publicaciones
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
