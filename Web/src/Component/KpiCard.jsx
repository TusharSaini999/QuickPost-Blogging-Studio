function KpiCard({ title, value, icon, tooltip, loading = false }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
      {loading ? (
        // Skeleton Loader
        <div className="animate-pulse space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div>
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
            <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ) : (
        // Normal KPI Card
        <>
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-gray-100 p-2 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {icon}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{tooltip}</span>
          </div>
          <div className="mt-3">
            <p className="text-sm font-medium uppercase tracking-wide text-red-600 dark:text-red-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default KpiCard;