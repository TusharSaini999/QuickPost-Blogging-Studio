import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Plus, ChevronLeft } from "lucide-react";

export default function AIAssistantSidebar({ fullPage = false }) {
  const [isOpen, setIsOpen] = useState(fullPage);
  const [isVisible, setIsVisible] = useState(fullPage);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const [activeChatIndex, setActiveChatIndex] = useState(null);

  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [sidebarHeight, setSidebarHeight] = useState(500);
  const [darkMode, setDarkMode] = useState(false);

  const containerRef = useRef(null);
  const rightResizerRef = useRef(null);
  const topResizerRef = useRef(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Auto scroll
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  // Resizing (desktop only)
  useEffect(() => {
    if (fullPage) return;

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;

      if (rightResizerRef.current?.isResizing) {
        document.body.style.userSelect = "none";
        let newWidth =
          rightResizerRef.current.startWidth -
          (e.clientX - rightResizerRef.current.startX);

        if (newWidth < 500) newWidth = 500;
        if (newWidth > 900) newWidth = 900;
        setSidebarWidth(newWidth);
      }

      if (topResizerRef.current?.isResizing) {
        document.body.style.userSelect = "none";
        const deltaY = topResizerRef.current.startY - e.clientY;
        let newHeight = topResizerRef.current.startHeight + deltaY;

        if (newHeight < 300) newHeight = 300;
        if (newHeight > window.innerHeight - 50)
          newHeight = window.innerHeight - 50;

        setSidebarHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      if (rightResizerRef.current) rightResizerRef.current.isResizing = false;
      if (topResizerRef.current) topResizerRef.current.isResizing = false;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [fullPage]);

  // Resize handlers
  const startHorizontalResize = (e) => {
    if (window.innerWidth < 768 || fullPage) return;
    rightResizerRef.current.isResizing = true;
    rightResizerRef.current.startX = e.clientX;
    rightResizerRef.current.startWidth = sidebarWidth;
  };
  const startVerticalResize = (e) => {
    if (window.innerWidth < 768 || fullPage) return;
    topResizerRef.current.isResizing = true;
    topResizerRef.current.startY = e.clientY;
    topResizerRef.current.startHeight = sidebarHeight;
  };

  // Fake AI response
  const addAIMessage = async (userMessage) => {
    setTyping(true);
    const aiResponse = `AI Suggestion for: "${userMessage}"`;
    let displayText = "";
    for (let i = 0; i < aiResponse.length; i++) {
      displayText += aiResponse[i];
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { type: "ai", text: displayText },
      ]);
      await new Promise((r) => setTimeout(r, 15));
    }
    setTyping(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { type: "user", text: input },
      { type: "ai", text: "" },
    ]);
    addAIMessage(input);
    setInput("");
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      const title = messages.find((m) => m.type === "user")?.text || "Chat";
      setChatHistory((prev) => [...prev, { title, messages }]);
    }
    setMessages([]);
    setActiveChatIndex(null);
  };

  const loadChat = (index) => {
    setMessages(chatHistory[index].messages);
    setActiveChatIndex(index);
  };

  const openSidebar = () => {
    setIsVisible(true);
    setIsOpen(true);
  };
  const closeSidebar = () => {
    if (fullPage) return; // full page mode can't close
    setIsOpen(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Floating Button (only when not fullPage) */}
      {!fullPage && !isVisible && (
        <button
          onClick={openSidebar}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="font-medium">AI Assistant</span>
        </button>
      )}

      {/* FullPage Mode OR Sidebar Mode */}
      {(fullPage || isVisible) && (
        <div
          className={`${fullPage
            ? "fixed inset-0 z-40 flex bg-white dark:bg-gray-900"
            : `fixed inset-0 z-50 flex justify-end items-end bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
            }`
            }`}
          onClick={!fullPage ? closeSidebar : undefined}
        >
          <div
            style={{
              width: fullPage ? "100%" : isMobile ? "100%" : sidebarWidth,
              height: fullPage ? "100%" : isMobile ? "100%" : sidebarHeight,
            }}
            className={`relative flex flex-col bg-white dark:bg-gray-900 shadow-xl ${fullPage ? "rounded-none" : isMobile ? "rounded-none" : "rounded-2xl"
              } transform transition-transform duration-300 ${fullPage ? "" : isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Resizers (not in fullPage or mobile) */}
            {!isMobile && !fullPage && (
              <>
                <div
                  ref={rightResizerRef}
                  onMouseDown={startHorizontalResize}
                  className="absolute top-0 left-0 h-full w-2 cursor-ew-resize z-50"
                />
                <div
                  ref={topResizerRef}
                  onMouseDown={startVerticalResize}
                  className="absolute top-0 left-0 w-full h-3 cursor-ns-resize z-50"
                />
              </>
            )}

            {/* Content */}
            <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-full`}>
              {/* History Sidebar */}
              {isHistoryOpen ? (
                <div
                  className={`border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300
      ${fullPage
                      ? "w-full sm:w-1/3 md:w-1/4 lg:w-1/5 min-w-[140px]" // Full on mobile, smaller on larger screens
                      : "w-full sm:w-1/2 md:w-1/3 min-w-[160px]"}         // Wider when not fullPage
    `}
                >
                  {/* Header */}
                  <div className="flex flex-col border-b border-red-600">
                    <div className="flex items-center justify-between p-4">
                      <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                        History
                      </h2>
                      <button
                        onClick={() => setIsHistoryOpen(false)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                      </button>
                    </div>
                    <div className="h-0.5 bg-red-600 w-full"></div>
                  </div>

                  {/* New Chat button */}
                  <button
                    onClick={startNewChat}
                    className="flex items-center gap-2 m-2 px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> New Chat
                  </button>

                  {/* Chat list */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {chatHistory.map((chat, idx) => (
                      <div
                        key={idx}
                        onClick={() => loadChat(idx)}
                        className={`p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${activeChatIndex === idx
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-gray-100 dark:bg-gray-800"
                          }`}
                      >
                        <span className="text-gray-800 dark:text-gray-200">
                          {chat.title.length > 30 ? chat.title.slice(0, 30) + "..." : chat.title}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {chat.messages[chat.messages.length - 1]?.text || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex md:flex-col items-center gap-4 p-2 bg-red-50 dark:bg-gray-800 border-r border-red-600 shadow-lg md:rounded-l-xl">
                  {/* Toggle open button */}
                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center justify-center w-12 h-12 rounded-r"
                    title="Open History"
                  >
                    <img src="../Logo/main.png" alt="" />
                  </button>

                  {/* New Chat button */}
                  <button
                    onClick={startNewChat}
                    className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all"
                    title="New Chat"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}


              {/* Chat Panel */}
              <div className="flex flex-col flex-1 p-4 relative">
                <div className="flex flex-col mb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                      AI Assistant
                    </h2>
                    {!fullPage && (
                      <button
                        onClick={closeSidebar}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </button>
                    )}
                  </div>
                  <div className="h-0.5 bg-red-600 w-full mt-2"></div>
                </div>

                {/* Messages */}
                <div
                  ref={containerRef}
                  className="flex-1 overflow-y-auto mb-3 space-y-2"
                >
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-2xl max-w-full break-words shadow-md ${msg.type === "user"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 self-end ml-auto"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        }`}
                    >
                      {msg.text ||
                        (msg.type === "ai" && typing ? (
                          <span className="animate-pulse">|</span>
                        ) : (
                          ""
                        ))}
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI..."
                    className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    onClick={handleSend}
                    className="rounded-md bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
