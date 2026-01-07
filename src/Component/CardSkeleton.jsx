function CardSkeleton() {
  return (
    <div
      className="relative max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-md
                 border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Image Placeholder */}
      <div className="relative">
        <div className="w-full h-55 bg-gray-200 dark:bg-gray-700 animate-pulse" />

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-md mb-3 animate-pulse" />

        {/* Description (2 lines) */}
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 animate-pulse" />

        {/* Author & Badge Row */}
        <div className="flex items-center justify-between mb-2">
          {/* Author */}
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse" />

          {/* Badge */}
          <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

export default CardSkeleton;
