import { Image, Reference, Slug } from 'sanity'

export interface Post {
  _id: string
  title: string
  slug: Slug
  mainImage?: Image
  publishedAt: string
  author: Reference
  categories: Reference[]
}
