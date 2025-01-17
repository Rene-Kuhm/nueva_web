export const postFields = `
  _id,
  title,
  'slug': slug.current,
  publishedAt,
  excerpt,
  mainImage,
  'author': author->{
    name, 
    image,
    bio
  },
  categories[]->{
    title
  },
  tags,
  body,
  'estimatedReadingTime': round(length(pt::text(body)) / 5 / 180 )
`;

export const queries = {
  getAllPosts: `*[_type == "post"] | order(publishedAt desc) {
    ${postFields}
  }`,
  
  getPostBySlug: `*[_type == "post" && slug.current == $slug][0] {
    ${postFields}
  }`,
  
  getPostsByCategory: `*[_type == "post" && references($categoryId)] | order(publishedAt desc) {
    ${postFields}
  }`,
  
  getRelatedPosts: `*[_type == "post" && references($categoryId) && _id != $currentPostId] | order(publishedAt desc) [0...3] {
    ${postFields}
  }`,
  
  getPostCount: `count(*[_type == "post"])`,
  
  getFeaturedPosts: `*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
    ${postFields}
  }`,
  
  getAuthorPosts: `*[_type == "post" && author._ref == $authorId] | order(publishedAt desc) {
    ${postFields}
  }`
};
