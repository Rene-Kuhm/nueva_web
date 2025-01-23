'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import { urlForImage } from '../../../sanity/lib/sanity.image';
import { BlogPost } from '../../lib/types';

export default function BlogPosts({
  initialPosts,
  initialCategories = [],
  initialTags = [],
  onFilterChange,
}: {
  initialPosts: BlogPost[];
  initialCategories?: string[];
  initialTags?: string[];
  onFilterChange?: (categories: string[], tags: string[]) => void;
}) {
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        (post.categories && selectedCategories.some((cat) => post.categories.includes(cat)));

      const tagMatch =
        selectedTags.length === 0 ||
        (post.tags && selectedTags.some((tag) => post.tags.includes(tag)));

      return categoryMatch && tagMatch;
    });

    setFilteredPosts(filtered);
    onFilterChange?.(selectedCategories, selectedTags);
  }, [selectedCategories, selectedTags, posts, onFilterChange]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {filteredPosts.map((post) => (
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
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              {post.categories && post.categories.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedCategories.includes(category)
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryToggle(category);
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedTags.includes(tag)
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTagToggle(tag);
                      }}
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
  );
}
