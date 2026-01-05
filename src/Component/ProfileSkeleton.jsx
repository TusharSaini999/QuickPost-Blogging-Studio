function ProfileSkeleton() {
    return (
        <main className="w-full sm:w-4/5 bg-white dark:bg-gray-800 p-6 sm:p-8 overflow-y-auto animate-pulse">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700 mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 sm:h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                    {[...Array(10)].map((_, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}

                    {/* Skills */}
                    <div className="flex gap-2 flex-wrap">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
export default ProfileSkeleton;