import { useState } from 'react'
import ChangelogForm from './components/ChangelogForm'
import ChangelogDisplay from './components/ChangelogDisplay'
import LoadingSpinner from './components/LoadingSpinner'

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
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-content py-12">
        {/* Header */}
        <div className="card text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Changelog Generator
          </h1>
          <p className="text-gray-600">
            Generate beautiful changelogs from your Git commits
          </p>
        </div>

        {/* Form Section */}
        <div className="card mb-8">
          <ChangelogForm onGenerate={handleGenerate} loading={loading} />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="card bg-red-50 border-l-4 border-red-500 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="card text-center">
            <LoadingSpinner />
          </div>
        )}

        {/* Results */}
        {changelog && !loading && (
          <div className="card">
            <ChangelogDisplay 
              changelog={changelog.changelog} 
              commits={changelog.commits} 
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <div className="card bg-gray-50">
            Built with modern web technologies
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
