import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChangelogDisplay({ changelog, commits }) {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Parse the markdown content into sections with grouped commits
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
    let currentChange = null;
    
    content.split('\n').forEach(line => {
      // Check for category headers
      if (line.match(/^#+\s*(🚀|🐛|🔧|📚)/)) {
        if (currentChange) {
          categories[currentCategory].push(currentChange);
          currentChange = null;
        }
        if (line.includes('🚀')) currentCategory = '🚀 Features';
        else if (line.includes('🐛')) currentCategory = '🐛 Bug Fixes';
        else if (line.includes('🔧')) currentCategory = '🔧 Maintenance';
        else if (line.includes('📚')) currentCategory = '📚 Documentation';
      }
      // New change item
      else if (line.startsWith('- ')) {
        if (currentChange) {
          categories[currentCategory].push(currentChange);
        }
        currentChange = {
          summary: line,
          details: [],
          commits: [],
          files: []
        };
      }
      // Related commits section
      else if (line.startsWith('  Related commits:')) {
        if (currentChange) {
          currentChange.showingCommits = true;
        }
      }
      // Commit message
      else if (line.startsWith('  > ') && currentChange?.showingCommits) {
        currentChange.commits.push(line.substring(4));
      }
      // Files affected (in parentheses)
      else if (line.match(/\(.*\)/) && currentChange) {
        const files = line.match(/\((.*)\)/)[1];
        currentChange.files = files.split(', ');
      }
      // Additional details
      else if (line.startsWith('  ') && currentChange) {
        currentChange.details.push(line.trim());
      }
    });
    
    // Add last change
    if (currentChange) {
      categories[currentCategory].push(currentChange);
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

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return Object.entries(sections).flatMap(([category, items]) => 
        items.map(item => ({ category, ...item }))
      );
    }
    return sections[activeCategory].map(item => ({
      category: activeCategory,
      ...item
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
      <div className="grid gap-6">
        {filteredItems.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Change Summary */}
            <div className="p-4">
              <div className="prose prose-blue max-w-none">
                <ReactMarkdown>{item.summary}</ReactMarkdown>
              </div>
              
              {/* Details */}
              {item.details.length > 0 && (
                <div className="mt-2 text-gray-600">
                  {item.details.map((detail, i) => (
                    <div key={i} className="ml-4">• {detail}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Files and Commits */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              {/* Files */}
              {item.files.length > 0 && (
                <div className="mb-2">
                  <div className="text-sm font-medium text-gray-500 mb-1">Modified files:</div>
                  <div className="flex flex-wrap gap-2">
                    {item.files.map((file, i) => (
                      <span key={i} className="text-xs bg-white px-2 py-1 rounded border">
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Commits */}
              {item.commits.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Related commits:</div>
                  <div className="space-y-1">
                    {item.commits.map((commit, i) => (
                      <div key={i} className="text-xs bg-white px-2 py-1 rounded border">
                        {commit}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Category Tag */}
              <div className="mt-3">
                <span className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No changes found in this category
        </div>
      )}

      <div className="text-sm text-gray-500 text-right">
        Based on {commits} commits
      </div>
    </div>
  );
} 