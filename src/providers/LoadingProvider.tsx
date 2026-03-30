import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type LoadingContextType = {
  loading: boolean;
  message: string;
  showLoading: (message: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: {children: React.ReactNode}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showLoading = useCallback((message: string) => {
    setMessage(message);
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    loading,
    message,
    showLoading,
    hideLoading,
  }), [loading, message, showLoading, hideLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}