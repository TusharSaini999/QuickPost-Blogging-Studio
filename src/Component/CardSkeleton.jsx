function CardSkeleton() {
  return (
    <div
      className="relative max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-md 
                 border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Image Placeholder */}
      <div className="relative">
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="h-5 w-2/3 bg-gray-300 dark:bg-gray-600 rounded-md mb-3 animate-pulse"></div>
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}

export default CardSkeleton;
