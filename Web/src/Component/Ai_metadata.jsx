function Ai_metadata({ loading, error, content, array, aiNotes, closeBtn, onCloseBtn, mainBtn, onMainBtn,arraytype }) {

    return (
        <>
            {(content||arraytype) && (
                <aside className="bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-700 rounded-2xl shadow-sm p-3 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Description */}
                        {content && (
                            <p className="flex-1 text-xs text-pink-600 dark:text-pink-200">
                                {content}
                            </p>
                        )}
                        <p className="flex-1 text-xs text-pink-600 dark:text-pink-200">
                            {array && array.join(", ")}
                        </p>
                        {mainBtn && (
                            <div className="flex items-center gap-2">
                                {/* Main Button */}
                                <button
                                    type="button"
                                    onClick={onMainBtn}
                                    disabled={loading}
                                    className="px-3 py-1.5 rounded-md text-white text-sm font-medium
        bg-gradient-to-r from-pink-500 via-red-500 to-pink-600
        hover:brightness-110 transition disabled:opacity-70
        flex items-center gap-2"
                                >
                                    {loading ? (
                                        <span
                                            className="w-4 h-4 border-2 border-white border-t-transparent
            rounded-full animate-spin"
                                        />
                                    ) : (
                                        mainBtn
                                    )}
                                </button>
                                {closeBtn && (
                                    <button
                                        type="button"
                                        onClick={onCloseBtn}
                                        className="w-7 h-7 flex items-center justify-center
        rounded-full text-pink-600 dark:text-pink-300
        hover:bg-pink-100 dark:hover:bg-pink-900
        transition"
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>
                                )}

                            </div>
                        )}


                    </div>

                    {/* AI NOTE PREVIEW */}
                    {aiNotes && (
                        <div className="mt-4 rounded-xl border border-pink-200 dark:border-pink-700 bg-white/90 dark:bg-gray-900/80 shadow-sm">
                            <div className="px-4 py-2 border-b border-pink-100 dark:border-pink-800">
                                <span className="text-xs font-semibold text-pink-600 dark:text-pink-300">
                                    AI
                                </span>
                            </div>
                            <div className="px-4 py-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                                {aiNotes}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
                    )}
                </aside>
            )}
        </>
    );
}

export default Ai_metadata