'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import { urlForImage } from '../../../sanity/lib/sanity.image';
import { BlogPost } from '../../lib/types';

export default function BlogPosts({
  initialPosts,
  initialTags = [],
  onFilterChange,
  onCategorySelect,
}: {
  initialPosts: BlogPost[];
  initialTags?: string[];
  onFilterChange?: (categories: string[], tags: string[]) => void;
  onCategorySelect?: (category: string) => void;
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  // Memoize unique categories and filtered posts to prevent unnecessary re-renders
  const uniqueCategories = useMemo(() => 
    Array.from(new Set(initialPosts.flatMap(post => post.categories || []))),
    [initialPosts]
  );

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const tagMatch =
        selectedTags.length === 0 ||
        (post.tags && selectedTags.some((tag) => post.tags.includes(tag)));

      return tagMatch;
    });
  }, [initialPosts, selectedTags]);

  // Use useEffect to call onFilterChange when dependencies change
  useEffect(() => {
    onFilterChange?.([...uniqueCategories], selectedTags);
  }, [uniqueCategories, selectedTags, onFilterChange]);

  const handleCategoryToggle = (category: string) => {
    // If onCategorySelect is provided, use it directly
    if (onCategorySelect) {
      onCategorySelect(category);
      return;
    }
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
          <article className="bg-gray-300 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
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
                    <button
                      key={category}
                      className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryToggle(category);
                      }}
                    >
                      {category}
                    </button>
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
                          ? 'bg-green-600 text-white'
                          : 'bg-green-50 text-green-600'
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
