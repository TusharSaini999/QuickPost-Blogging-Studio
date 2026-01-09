import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

function Card({
    postType = "Public",
    imageLink = "https://picsum.photos/400/250",
    title = "Untitled Post",
    authorName = "Unknown Author",
    updatedAt = "2025-09-03T14:45:00",
    shortDescription = "This is the short description of the post. It should look clean, subtle, and not overpower the title.",
    delet = () => { console.log("You Click The Delete") },
    onClick = () => { console.log("You Click The Card") },
    onEdit = () => { console.log("Edit") },
    editmode = true
}) {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursorPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };
    const handleMouseLeave = () => {
        setCursorPos({ x: 0, y: 0 });
    };

    // Format date & time
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Visibility badge theme
    const badgeStyles = {
        Public: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
        Private: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
        Draft: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
    };
    
    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-md 
                 border border-gray-200 dark:border-gray-700 overflow-hidden 
                 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{
                background: `radial-gradient(200px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(255,107,53,0.15), transparent 80%)`,
            }}
        >
            {/* Image Header */}
            <div className="relative">
                <img src={imageLink} alt={title} onClick={onClick} className="w-full h-55 object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                    {editmode && (
                        <><button
                            className="p-2 bg-gray-800/70 hover:bg-gray-900 text-white rounded-full transition-transform transform hover:scale-110 shadow-md"
                            onClick={onEdit}
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                            <button
                                onClick={delet}
                                className="p-2 bg-red-600/80 hover:bg-red-700 text-white rounded-full transition-transform transform hover:scale-110 shadow-md"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>)}
                </div>
            </div>

            {/* Body */}
            <div className="p-4" onClick={onClick}>
                {/* Title */}
                <h5 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {title}
                </h5>

                {/* Short Description */}
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {shortDescription}
                </p>
                <div className="mb-3 flex items-center justify-between">
                    {/* Author */}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        By{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {authorName || "Author Name"}
                        </span>
                    </p>

                    {/* Badge */}
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${badgeStyles[postType]}`}
                    >
                        {postType}
                    </span>
                </div>

            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 flex justify-between">
                <span>Last Updated: {formatDate(updatedAt)}</span>
            </div>
        </div>
    );
}

export default Card;
