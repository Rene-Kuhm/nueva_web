export default function BlogPostsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-white animate-pulse rounded-lg overflow-hidden shadow-md">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-5">
            <div className="h-6 bg-gray-200 mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 mb-2 w-full"></div>
            <div className="flex items-center justify-between mt-4">
              <div className="h-4 bg-gray-200 w-1/4"></div>
              <div className="h-4 bg-gray-200 w-1/4"></div>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="h-6 bg-gray-200 w-16 rounded-full"></div>
              <div className="h-6 bg-gray-200 w-16 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
