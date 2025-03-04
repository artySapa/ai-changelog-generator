import { useState } from 'react'
import ChangelogForm from './components/ChangelogForm'
import './App.css'

function App() {
  const [changelog, setChangelog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setChangelog(data);
    } catch (err) {
      setError(err.message || 'Failed to generate changelog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">AI Changelog Generator</h1>
      
      <ChangelogForm onGenerate={handleGenerate} loading={loading} />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="mt-4">
          Generating changelog...
        </div>
      )}
      
      {changelog && !loading && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Changelog</h2>
          <div className="bg-gray-100 p-6 rounded">
            <pre className="whitespace-pre-wrap">{changelog.changelog}</pre>
            <div className="mt-4 text-sm text-gray-600">
              Generated from {changelog.commits} commits
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
