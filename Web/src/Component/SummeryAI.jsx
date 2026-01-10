// components/SummaryGenerator.jsx
import React, { useState, useMemo } from "react";
import ai_function from "../Appwrite/ai_function";
import { htmlToText } from "html-to-text";

const SummaryGenerator = ({
  title = "",
  shortDescription = "",
  content = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [lengthIndex, setLengthIndex] = useState(1); // 0 = Short, 1 = Medium, 2 = Long
  const [copied, setCopied] = useState(false); // for copy animation

  const lengthOptions = ["Short", "Medium", "Long"];

  const plainTextContent = useMemo(() => {
    if (!content) return "";

    return htmlToText(content, {
      wordwrap: false,
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "a", options: { ignoreHref: true } },
      ],
    });
  }, [content]);

  const handleGenerate = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await ai_function.ai_summery({
        title,
        shortDescription,
        content: plainTextContent,
        length: lengthOptions[lengthIndex],
      });
      if (res?.success) {
        setSummary(res.summary);
      } else {
        setError(res?.error || "Failed to generate summary");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  return (
    <aside className="bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-700 rounded-2xl shadow-sm p-3 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Description */}
        <p className="flex-1 text-xs text-pink-600 dark:text-pink-200">
          Generate a quick summary of this post using AI. Choose the length and
          click “Generate Summary”.
        </p>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-3 py-1.5 rounded-md text-white text-sm font-medium
            bg-gradient-to-r from-pink-500 via-red-500 to-pink-600
            hover:brightness-110 transition disabled:opacity-70"
          >
            {loading ? "Generating..." : "Generate Summary"}
          </button>

          {/* Slider */}
          <div className="w-full sm:w-32">
            <input
              type="range"
              min={0}
              max={2}
              value={lengthIndex}
              onChange={(e) => setLengthIndex(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer 
              bg-pink-200 dark:bg-pink-700
              accent-pink-500" // Tailwind 3.2+ supports accent-color
            />
            <div className="flex justify-between text-xs text-pink-600 dark:text-pink-200 mt-1">
              {lengthOptions.map((opt, idx) => (
                <span key={idx} className={idx === lengthIndex ? "font-bold" : ""}>
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      {summary && (
        <div className="mt-4 rounded-xl border border-pink-200 dark:border-pink-700 bg-white/90 dark:bg-gray-900/80 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 border-b border-pink-100 dark:border-pink-800">
            <span className="text-xs font-semibold text-pink-600 dark:text-pink-300">
              AI SUMMARY
            </span>
            <button
              onClick={handleCopy}
              className={`text-xs text-pink-500 hover:text-pink-700 transition relative`}
            >
              {copied ? (
                <span className="animate-bounce text-green-500">Copied!</span>
              ) : (
                "Copy"
              )}
            </button>
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
            {summary}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </aside>
  );
};

export default SummaryGenerator;
