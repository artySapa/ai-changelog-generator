import Loader from './Loader';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader />
      <div className="text-lg font-medium text-gray-700 animate-pulse">
        Analyzing commits and generating changelog...
      </div>
      <div className="text-sm text-gray-500">
        This might take a minute for repositories with many commits
      </div>
    </div>
  );
} 