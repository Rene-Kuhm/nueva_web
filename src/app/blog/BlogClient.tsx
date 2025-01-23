'use client';

import React, { useState } from 'react';
import { BlogClientProps } from '../../lib/types';

export default function BlogClient({ initialCategories, initialTags }: BlogClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    <div className=" bg-gray-400 p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Categorías</h2>
        <div className="space-y-2">
          {initialCategories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="form-checkbox h-4 w-4 text-gray-500"
              />
              <span>{category}</span>
            </label>
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
