'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, User, X, ChevronLeft } from 'lucide-react';
import { urlForImage } from '../../../sanity/lib/sanity.image';
import BlogClient from './BlogClient';
import BlogPosts from './BlogPosts';
import { BlogPost } from '../../lib/types';

interface BlogPageClientProps {
  posts: BlogPost[];
  uniqueCategories: string[];
  uniqueTags: string[];
}

export default function BlogPageClient({
  posts,
  uniqueCategories,
  uniqueTags,
}: BlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams?.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Take the first 2 posts for the carousel, ensuring they have images
  const carouselPosts = posts
    .filter(post => post.image && post.image !== '/placeholder.jpg')
    .slice(0, 2);

  const filterPosts = useCallback(() => {
    let result = posts;

    // Filter by category first
    if (category) {
      result = result.filter(post => 
        post.categories.some(cat => 
          cat.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Then filter by search query
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.categories.some(cat => 
            cat.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredPosts(result);
  }, [posts, category, searchQuery]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  useEffect(() => {
    // Auto-advance carousel every 5 seconds, but only if there are carousel posts
    if (carouselPosts.length > 1) {
      const carouselInterval = setInterval(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % carouselPosts.length);
      }, 5000);

      return () => clearInterval(carouselInterval);
    }
  }, [carouselPosts.length]);

  const handleCategorySelect = (selectedCategory: string) => {
    // Update URL with category parameter
    router.push(`/blog?category=${encodeURIComponent(selectedCategory)}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    router.push('/blog');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="blog-page w-full pt-24">
      {/* Back Button for navigation */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <button 
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft size={24} />
          <span>Volver</span>
        </button>
        
        {/* Clear Filters Button */}
        {(category || searchQuery) && (
          <button 
            onClick={clearFilters}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <X size={24} />
            <span>Limpiar Filtros</span>
          </button>
        )}
      </div>

      {/* Header Section */}
      <div className="mb-12 text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {category ? `Categoría: ${category}` : 'Explora Nuestro Blog'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {category 
            ? `Artículos relacionados con la categoría ${category}` 
            : 'Descubre ideas innovadoras, consejos prácticos y las últimas tendencias en tecnología y desarrollo web.'}
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-12 px-4">
        <div className="relative max-w-xl mx-auto group">
          <div className="relative">
            <input
              type="text"
              placeholder="Busca artículos, categorías o temas..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full px-6 py-3 pr-12 rounded-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-300 shadow-md text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={clearFilters}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            )}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      {carouselPosts.length > 0 && (
        <div className="mb-12 px-4">
          <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              {carouselPosts.map((post, index) => (
                index === currentCarouselIndex && (
                  <motion.div
                    key={`carousel-${post._id}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={post.image || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="absolute inset-0 z-0"
                    />
                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                      <h2 className="text-3xl font-bold mb-3">{post.title}</h2>
                      <p className="text-lg mb-4">{post.description}</p>
                      <div className="flex items-center space-x-4">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid md:grid-cols-3 gap-8 px-4">
        {filteredPosts.length > 0 && (
          <div className="md:col-span-2">
            <BlogPosts
              initialPosts={filteredPosts}
              initialTags={uniqueTags}
              onCategorySelect={handleCategorySelect}
              showBackButton={true}
            />
          </div>
        )}

        <div>
          <BlogClient 
            initialCategories={uniqueCategories} 
            initialTags={uniqueTags}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>

      {/* Hidden elements for import resolution */}
      <div style={{ display: 'none' }}>
        <Image src="/placeholder.jpg" alt="Placeholder" width={100} height={100} />
        <Clock size={24} />
        <User size={24} />
        {urlForImage('image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg')?.width(100).height(100).url()}
      </div>
    </div>
  );
}
