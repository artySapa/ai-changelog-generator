import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChangelogDisplay({ changelog, commits }) {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Parse the markdown content into sections
  const sections = useMemo(() => {
    const content = changelog || '';
    const categories = {
      '🚀 Features': [],
      '🐛 Bug Fixes': [],
      '🔧 Maintenance': [],
      '📚 Documentation': [],
      'other': []
    };
    
    let currentCategory = 'other';
    let currentItem = '';
    
    content.split('\n').forEach(line => {
      // Check for category headers first
      if (line.match(/^#+\s*(🚀|🐛|🔧|📚)/)) {
        if (currentItem) {
          categories[currentCategory].push(currentItem.trim());
          currentItem = '';
        }
        if (line.includes('🚀')) currentCategory = '🚀 Features';
        else if (line.includes('🐛')) currentCategory = '🐛 Bug Fixes';
        else if (line.includes('🔧')) currentCategory = '🔧 Maintenance';
        else if (line.includes('📚')) currentCategory = '📚 Documentation';
      }
      // Check for list items
      else if (line.startsWith('- ')) {
        if (currentItem) {
          categories[currentCategory].push(currentItem.trim());
        }
        currentItem = line;
      }
      // Append to current item
      else if (currentItem) {
        currentItem += '\n' + line;
      }
      // Start new item if we have content but no current item
      else if (line.trim()) {
        currentItem = line;
      }
    });
    
    // Add last item
    if (currentItem) {
      categories[currentCategory].push(currentItem.trim());
    }
    
    return categories;
  }, [changelog]);

  const categories = [
    { id: 'all', label: 'All Changes', icon: '📋' },
    { id: '🚀 Features', label: 'Features', icon: '🚀' },
    { id: '🐛 Bug Fixes', label: 'Bug Fixes', icon: '🐛' },
    { id: '🔧 Maintenance', label: 'Maintenance', icon: '🔧' },
    { id: '📚 Documentation', label: 'Documentation', icon: '📚' }
  ];

  // Get filtered items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return Object.entries(sections).flatMap(([category, items]) => 
        items.map(item => ({ category, content: item }))
      );
    }
    return sections[activeCategory].map(item => ({
      category: activeCategory,
      content: item
    }));
  }, [sections, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
        {categories.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${activeCategory === id 
                ? 'bg-blue-500 text-white shadow-md transform -translate-y-0.5' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}
            `}
          >
            <span className="mr-2">{icon}</span>
            {label}
            <span className="ml-2 text-xs">
              ({id === 'all' ? Object.values(sections).flat().length : sections[id]?.length || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Changelog Content */}
      <div className="grid gap-4">
        {filteredItems.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <span className="inline-block px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No changes found in this category
        </div>
      )}

      {/* Commit Count */}
      <div className="text-sm text-gray-500 text-right">
        Based on {commits} commits
      </div>
    </div>
  );
} 