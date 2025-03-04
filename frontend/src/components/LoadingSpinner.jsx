export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0"></div>
      </div>
      <div className="ml-4 text-lg font-medium text-gray-700">
        Generating changelog...
      </div>
    </div>
  );
} 