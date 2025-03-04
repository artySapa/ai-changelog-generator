import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChangelogDisplay({ changelog, commits }) {
  const [activeCategory, setActiveCategory] = useState('all');
  
  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Generated Changelog</h2>
        <p className="text-sm text-gray-600">Based on {commits} commits</p>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Changes
          </button>
          {['🚀 Features', '🐛 Bug Fixes', '🔧 Maintenance', '📚 Documentation'].map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="prose prose-blue max-w-none">
          <ReactMarkdown>{changelog}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 