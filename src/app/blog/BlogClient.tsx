'use client';

import React, { useState } from 'react';
import { BlogClientProps } from '../../lib/types';

interface ExtendedBlogClientProps extends BlogClientProps {
  onCategorySelect?: (category: string) => void;
}

export default function BlogClient({ 
  initialCategories, 
  initialTags, 
  onCategorySelect 
}: ExtendedBlogClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    // If onCategorySelect is provided, use it directly
    if (onCategorySelect) {
      onCategorySelect(category);
      return;
    }

    // Otherwise, use the existing multi-select behavior
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
    <div className="bg-gray-400 p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Categorías</h2>
        <div className="space-y-2">
          {initialCategories.map((category) => (
            <button 
              key={category} 
              onClick={() => handleCategoryToggle(category)}
              className="flex items-center space-x-2 cursor-pointer w-full text-left hover:bg-gray-300 p-2 rounded"
            >
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-black">Etiquetas</h2>
        <div className="space-y-2">
          {initialTags.map((tag) => (
            <label key={tag} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
                className="form-checkbox h-4 w-4 text-gray-500"
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
