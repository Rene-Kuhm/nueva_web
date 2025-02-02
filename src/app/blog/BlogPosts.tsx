'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Clock, User, ChevronLeft } from 'lucide-react';
import { urlForImage } from '../../../sanity/lib/sanity.image';
import { BlogPost, isValidBlogPost } from '@/lib/types';

export default function BlogPosts({
  initialPosts,
  initialTags = [],
  onFilterChange,
  onCategorySelect,
  showBackButton = false,
}: {
  initialPosts: BlogPost[];
  initialTags?: string[];
  onFilterChange?: (categories: string[], tags: string[]) => void;
  onCategorySelect?: (category: string) => void;
  showBackButton?: boolean;
}) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  // Robust unique key generation function
  const getUniquePostKey = (post: BlogPost, index: number): string => {
    // Combine multiple unique identifiers with added entropy
    const baseKey = [
      post._id || 'unknown',
      post.slug?.current || 'no-slug',
      post.title || '',
      index.toString(),
      // Add more entropy sources
      post.publishedAt || '',
      post.author || ''
    ].join('-');
    
    // Create a hash to further ensure uniqueness
    const hashKey = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    // Combine base key with hash and random entropy
    return `post-${baseKey}-${hashKey(baseKey)}-${Math.random().toString(36).substr(2, 5)}`;
  };

  // Unique key generation for tags
  const getUniqueTagKey = (post: BlogPost, tag: string, postKey: string): string => {
    // Combine post key, tag, and additional entropy
    const baseTagKey = [
      postKey,
      tag,
      post._id || 'unknown',
      post.slug?.current || 'no-slug'
    ].join('-');

    // Add a hash for extra uniqueness
    const hashKey = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    };

    return `tag-${baseTagKey}-${hashKey(baseTagKey)}-${Math.random().toString(36).substr(2, 5)}`;
  };

  // Helper function to convert Sanity image URL to Next.js compatible format
  const convertImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return '/placeholder.svg'; // Fallback placeholder

    try {
      const url = urlForImage(imageUrl).url();
      return url || '/placeholder.svg';
    } catch (error) {
      console.warn('Image URL conversion failed:', error);
      return '/placeholder.svg';
    }
  };

  // Filter and prepare posts for rendering
  const renderPosts = useMemo(() => {
    const validPosts = initialPosts.filter(post =>
      post._id &&
      post.slug?.current &&
      (selectedTags.length === 0 || post.tags && selectedTags.some(tag => post.tags.includes(tag)))
    );

    const usedKeys = new Set<string>();
    
    return validPosts.map((post, index) => {
      let uniquePostKey = getUniquePostKey(post, index);
      
      // Ensure absolute post key uniqueness
      let attempts = 0;
      while (usedKeys.has(uniquePostKey) && attempts < 100) {
        uniquePostKey = getUniquePostKey(post, index + attempts);
        attempts++;
      }
      
      // Fallback if unique key cannot be generated
      if (usedKeys.has(uniquePostKey)) {
        uniquePostKey += `-fallback-${Date.now()}`;
      }
      
      usedKeys.add(uniquePostKey);
      return { post, uniquePostKey };
    });
  }, [initialPosts, selectedTags]);

  // Compute unique categories based on rendered posts
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    renderPosts.forEach(({ post }) => {
      if (post.categories) {
        post.categories.forEach(cat => categories.add(cat));
      }
    });
    return Array.from(categories);
  }, [renderPosts]);

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

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div>
      {/* Back Button */}
      {showBackButton && (
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft size={24} />
            <span>Volver</span>
          </button>
        </div>
      )}

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {renderPosts.map(({ post, uniquePostKey }) => (
            <div
              key={uniquePostKey}
              className="perspective-1000"
            >
              <a
                href={`/blog/${post.slug.current}`}
                className="block transform transition-transform duration-300 hover:scale-105"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                  {post.image && (
                    <div className="relative pt-[56.25%]">
                      <Image
                        src={convertImageUrl(post.image)}
                        alt={post.title}
                        layout="fill"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <User className="w-4 h-4 mr-2" />
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                      {post.categories && post.categories.map((category) => (
                        <span
                          key={getUniqueTagKey(post, category, uniquePostKey)}
                          className="px-3 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                        >
                          {category}
                        </span>
                      ))}
                      {post.tags && post.tags.map((tag, index) => (
                        <span
                          key={getUniqueTagKey(post, tag, uniquePostKey) + index}
                          className={`px-3 py-1 rounded-full text-xs ${
                            selectedTags.includes(tag)
                              ? 'bg-green-600 text-white dark:bg-green-500 dark:text-white'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                          } transition-colors cursor-pointer`}
                          onClick={() => {
                            const newSelectedTags = selectedTags.includes(tag)
                              ? selectedTags.filter((t) => t !== tag)
                              : [...selectedTags, tag];
                            setSelectedTags(newSelectedTags);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
        {renderPosts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
              No posts found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
