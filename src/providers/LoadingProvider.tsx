import { createContext, useContext, useEffect, useMemo, useState } from "react";

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

  const showLoading = (message: string) => {
    setMessage(message);
    setLoading(true);
  }

  const hideLoading = () => {
    setMessage("");
    setLoading(false);
  }

  return (
    <LoadingContext.Provider value={{ loading, message, showLoading, hideLoading }}>
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