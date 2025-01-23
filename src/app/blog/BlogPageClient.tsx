'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import BlogPosts from './BlogPosts';
import { BlogPost } from '../../lib/types';

// Componente de carga para búsqueda
function SearchParamsLoader() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );
}

// Componente que maneja los parámetros de búsqueda
function BlogSearchHandler({
  posts,
  uniqueCategories,
  uniqueTags
}: {
  posts: BlogPost[];
  uniqueCategories: string[];
  uniqueTags: string[];
}) {
  const searchParams = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Efecto para filtrar posts basado en parámetros de búsqueda
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');

    let filtered = posts;

    if (categoryParam) {
      filtered = filtered.filter(post => 
        post.categories.includes(categoryParam)
      );
      setSelectedCategories([categoryParam]);
    }

    if (tagParam) {
      filtered = filtered.filter(post => 
        post.tags.includes(tagParam)
      );
      setSelectedTags([tagParam]);
    }

    setFilteredPosts(filtered);
  }, [searchParams, posts]);

  // Manejador para seleccionar categorías
  const handleCategorySelect = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    
    const filtered = posts.filter(post => 
      newCategories.length === 0 || 
      newCategories.some(cat => post.categories.includes(cat))
    );
    
    setFilteredPosts(filtered);
  };

  // Manejador para filtrar tags
  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    
    const filtered = posts.filter(post => 
      newTags.length === 0 || 
      newTags.some(selectedTag => post.tags.includes(selectedTag))
    );
    
    setFilteredPosts(filtered);
  };

  return (
    <div>
      {/* Filtros de categorías */}
      {uniqueCategories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {uniqueCategories.map(category => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Filtros de tags */}
      {uniqueTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {uniqueTags.map(tag => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Lista de posts filtrados */}
      <BlogPosts 
        initialPosts={filteredPosts} 
        initialTags={selectedTags}
        onCategorySelect={handleCategorySelect}
        showBackButton={true}
      />
    </div>
  );
}

export default function BlogPageClient({
  posts,
  uniqueCategories,
  uniqueTags
}: {
  posts: BlogPost[];
  uniqueCategories: string[];
  uniqueTags: string[];
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Últimos Artículos</h1>
      
      <Suspense fallback={<SearchParamsLoader />}>
        <BlogSearchHandler 
          posts={posts}
          uniqueCategories={uniqueCategories}
          uniqueTags={uniqueTags}
        />
      </Suspense>
    </div>
  );
}
