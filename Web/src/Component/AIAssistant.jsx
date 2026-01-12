import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import ai_function from "../Appwrite/ai_function";

export default function AIAssistantSidebar({ fullPage = false, page = "Dashboard", AICall }) {
  // Chat state
  const [isOpen, setIsOpen] = useState(fullPage);
  const [isVisible, setIsVisible] = useState(fullPage);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  // Sidebar size
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [sidebarHeight, setSidebarHeight] = useState(500);

  // Resizer refs
  const containerRef = useRef(null);
  const leftResizerRef = useRef(null);
  const rightResizerRef = useRef(null);
  const topResizerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // User data
  const userData = useSelector((s) => s.AuthSlice.userData);

  // Base data for AI
  let Data = {
    name: userData?.name || "User",
    totalPosts: {
      Drafts: userData?.prefs?.Drafts || 0,
      Private: userData?.prefs?.Private || 0,
      Public: userData?.prefs?.Public || 0,
    },
    postPerWeek: userData?.prefs?.Week || 0,
    navigationMenu: ["Home", "Profile", "Create Post", "My Post", "Public Post", "Logout"],
  };

  // Auto scroll when open
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 40;
      const atBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

      shouldAutoScrollRef.current = atBottom;
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [isOpen, isVisible]);

  const scrollToBottom = (force = false) => {
    const el = containerRef.current;
    if (!el) return;

    if (!force && !shouldAutoScrollRef.current) return;

    requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "auto", // IMPORTANT
      });
    });
  };


  //Autoscroll When chat
  useEffect(() => { if (containerRef.current) { containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" }); } }, [messages, typing]);

  // Resizing logic
  useEffect(() => {
    if (fullPage) return;

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return;

      if (leftResizerRef.current?.isResizing) {
        const newWidth = leftResizerRef.current.startWidth + (leftResizerRef.current.startX - e.clientX);
        setSidebarWidth(Math.max(400, Math.min(newWidth, 900)));
      }
      if (rightResizerRef.current?.isResizing) {
        const newWidth = rightResizerRef.current.startWidth + (e.clientX - rightResizerRef.current.startX);
        setSidebarWidth(Math.max(400, Math.min(newWidth, 900)));
      }
      if (topResizerRef.current?.isResizing) {
        const deltaY = topResizerRef.current.startY - e.clientY;
        const newHeight = topResizerRef.current.startHeight + deltaY;
        setSidebarHeight(Math.max(300, Math.min(newHeight, window.innerHeight - 50)));
      }
    };

    const handleMouseUp = () => {
      leftResizerRef.current && (leftResizerRef.current.isResizing = false);
      rightResizerRef.current && (rightResizerRef.current.isResizing = false);
      topResizerRef.current && (topResizerRef.current.isResizing = false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [fullPage]);

  const startResize = (ref, e) => {
    if (window.innerWidth < 768 || fullPage) return;
    ref.current.isResizing = true;
    ref === leftResizerRef || ref === rightResizerRef
      ? (ref.current.startX = e.clientX)
      : (ref.current.startY = e.clientY);
    ref === leftResizerRef || ref === rightResizerRef
      ? (ref.current.startWidth = sidebarWidth)
      : (ref.current.startHeight = sidebarHeight);
  };

  // AI call
  const aiCall = async ({ userQuery, userContext }) => {
    try {
      const res = await ai_function.aiChat({ userQuery, userContext });
      if (res.success) return res.reply;
      throw new Error(res.error || "AI call failed");
    } catch (err) {
      throw err;
    }
  };

  // Add AI message
  const addAIMessage = async (userMessage) => {
    setTyping(true);
    if (page === "Dashboard") {
      Data = {
        ...Data,
        dashboardSummary: { welcomeMessage: "Welcome back, Tushar Saini" },
        visibleSections: ["Top Navigation", "Dashboard Overview", "Post Statistics", "Quick Links", "Post Charts"],
        quickLinks: ["New Post", "All Posts", "My Public Post", "My Private Post", "Drafts Post", "All Public Post"],
        currentPageOnUser: "Dashboard",
      };
    } else {
      const PageData = AICall();
      Data = { ...Data, ...PageData };
      console.log("This is The Page Data Come Form:", PageData);
    }
    console.log("This Is Data For LLm", Data);
    // Add placeholder AI message
    let messageIndex;
    setMessages((prev) => {
      messageIndex = prev.length;
      return [...prev, { type: "ai", text: "", loading: true, error: "" }];
    });

    try {
      const aiResponse = await aiCall({ userQuery: userMessage, userContext: Data });
      let displayText = "";
      for (let i = 0; i < aiResponse.length; i++) {
        displayText += aiResponse[i];
        setMessages((prev) => {
          const updated = [...prev];
          updated[messageIndex] = { type: "ai", text: displayText, loading: false, error: "" };
          return updated;
        });
        await new Promise((r) => setTimeout(r, 10));
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[messageIndex] = { type: "ai", text: "", loading: false, error: err.message };
        return updated;
      });
    } finally {
      setTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    addAIMessage(input);
    setInput("");
  };

  return (
    <div className="font-sans">
      {!fullPage && !isVisible && (
        <button
          onClick={() => {
            setIsVisible(true);
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full 
          bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 text-white shadow-xl 
          hover:scale-105 transition-transform duration-200 group"
        >
          <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </button>
      )}

      {(fullPage || isVisible) && (
        <div
          className={`${fullPage
            ? "fixed inset-0 z-40 flex bg-white dark:bg-gray-900"
            : `fixed inset-0 z-50 flex justify-end items-end transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
            }`
            }`}
          onClick={!fullPage ? () => { setIsOpen(false); setTimeout(() => setIsVisible(false), 300); } : undefined}
        >
          <div
            style={{
              width: fullPage ? "100%" : isMobile ? "100%" : sidebarWidth,
              height: fullPage ? "100%" : isMobile ? "100%" : sidebarHeight,
            }}
            className={`relative flex flex-col bg-white/50 dark:bg-gray-950/30 shadow-2xl backdrop-blur-md overflow-hidden ${fullPage ? "" : isMobile ? "rounded-t-3xl" : "rounded-tl-3xl border-l border-t border-pink-100 dark:border-pink-800/50"
              } transform transition-transform duration-300 ${fullPage ? "" : isOpen ? "translate-x-0" : "translate-x-full"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Resizers */}
            {!isMobile && !fullPage && (
              <>
                <div ref={leftResizerRef} onMouseDown={(e) => startResize(leftResizerRef, e)} className="absolute top-0 left-0 h-full w-2 cursor-ew-resize z-50 hover:bg-pink-400/20" />
                <div ref={rightResizerRef} onMouseDown={(e) => startResize(rightResizerRef, e)} className="absolute top-0 right-0 h-full w-2 cursor-ew-resize z-50 hover:bg-pink-400/20" />
                <div ref={topResizerRef} onMouseDown={(e) => startResize(topResizerRef, e)} className="absolute top-0 left-0 w-full h-2 cursor-ns-resize z-50 hover:bg-pink-400/20" />
              </>
            )}

            {/* Header */}
            <div className="px-6 py-4 bg-pink-50/70 dark:bg-pink-900/30 border-b border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-red-500 flex items-center justify-center shadow-md shadow-pink-200 dark:shadow-none">
                  <Sparkles className="text-white h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider">AI Assistant</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-pink-500/80 font-medium">Online & Ready</span>
                  </div>
                </div>
              </div>
              {!fullPage && (
                <button onClick={() => { setIsOpen(false); setTimeout(() => setIsVisible(false), 300); }} className="p-2 rounded-full text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Chat Body */}
            <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-hidden p-6 space-y-6 bg-white/10 dark:bg-gray-950/20 backdrop-blur-sm">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-20 h-20 bg-pink-50/50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-10 w-10 text-pink-400" />
                  </div>
                  <h3 className="text-pink-600 dark:text-pink-400 font-semibold">How can I assist you?</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Ask me anything or try a suggestion below.</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.type === "ai" ? (
                    <aside className="w-full max-w-[90%] bg-pink-50/70 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-700 rounded-2xl shadow-sm p-4">
                      {/* Header with AI label */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-pink-600 dark:text-pink-300 uppercase tracking-widest bg-white/70 dark:bg-pink-800/50 px-2 py-0.5 rounded border border-pink-100 dark:border-pink-600">
                          AI
                        </span>

                        {/* Show either Loading OR Error */}
                        {!msg.loading && msg.error && <span className="text-xs text-red-500">{msg.error}</span>}
                      </div>

                      {/* AI Message Body */}
                      <div className="text-sm leading-relaxed text-gray-700 dark:text-pink-100">
                        {!msg.loading && !msg.error && msg.text}
                        {msg.loading && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-t-pink-500 border-gray-300 rounded-full animate-spin"></div>
                            <span>Generating response...</span>
                          </div>
                        )}
                      </div>
                    </aside>
                  ) : (
                    <div className="max-w-[80%] bg-gradient-to-r from-pink-500 to-red-500 text-white p-3.5 rounded-2xl rounded-tr-none shadow-lg shadow-pink-200 dark:shadow-none text-sm font-medium">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}


            </div>

            {/* Footer */}
            <div className="p-4 border-t border-pink-50 dark:border-pink-900/30 bg-white/10 dark:bg-gray-950/30 backdrop-blur-sm">
              <div className="relative flex items-center gap-2 bg-gray-50/30 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/50 p-2 rounded-2xl focus-within:ring-2 ring-pink-500/20 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { handleSend(); } }}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-gray-800 dark:text-pink-50 focus:outline-none placeholder:text-pink-300 dark:placeholder:text-pink-700"
                />
                <button
                  onClick={() => { handleSend(); }}
                  disabled={!input.trim() || typing}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 text-white shadow-md hover:brightness-110 disabled:opacity-40 disabled:grayscale transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-pink-300 mt-2 font-medium">Powered by QuickPost using Gemini</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


