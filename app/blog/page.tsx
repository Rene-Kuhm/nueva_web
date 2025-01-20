import { client } from '../../sanity/lib/client'

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: {
    asset: {
      url: string;
    };
  };
  publishedAt: string;
  author: {
    name: string;
  };
  categories: Array<{
    title: string;
  }>;
}

async function getPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post" && published == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      author->,
      categories[]->
    }
  `
  return client.fetch(query)
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div>
      <h1>Blog</h1>
      {posts?.length > 0 ? (
        <div>
          {posts.map((post: Post) => (
            <div key={post._id}>
              <h2>{post.title}</h2>
              {/* Add your post preview components here */}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay posts publicados.</p>
      )}
    </div>
  )
}
