import { createContext, useContext, useMemo, useState } from "react";

const AIPageContext = createContext(null);

export function AIPageContextProvider({ children }) {
  const [pageAIContext, setPageAIContext] = useState(null);

  const value = useMemo(() => ({
    pageAIContext,
    setPageAIContext,
  }), [pageAIContext]);

  return <AIPageContext.Provider value={value}>{children}</AIPageContext.Provider>;
}

export function useAIPageContext() {
  const context = useContext(AIPageContext);

  if (!context) {
    throw new Error("useAIPageContext must be used within AIPageContextProvider");
  }

  return context;
}