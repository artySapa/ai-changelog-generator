import { useState } from 'react';

export default function ChangelogForm({ onGenerate, loading }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [dateRange, setDateRange] = useState('7'); // days
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!repoUrl.includes('github.com')) {
      setFormError('Please enter a valid GitHub repository URL');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/changelog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl,
          days: parseInt(dateRange)
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate changelog');
      }
      
      const data = await response.json();
      onGenerate(data);
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="repoUrl" className="block text-sm font-medium mb-1">
          GitHub Repository URL:
        </label>
        <input
          type="text"
          id="repoUrl"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="w-full px-3 py-2 border rounded"
          required
          disabled={loading}
        />
      </div>
      
      <div>
        <label htmlFor="dateRange" className="block text-sm font-medium mb-1">
          Days to include:
        </label>
        <select
          id="dateRange"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          disabled={loading}
        >
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      {formError && (
        <div className="text-red-600 text-sm">
          {formError}
        </div>
      )}

      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Changelog'}
      </button>
    </form>
  );
} 