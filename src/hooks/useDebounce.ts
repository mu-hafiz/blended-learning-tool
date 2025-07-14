import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
      setReady(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value]);

  return {
    ready,
    value: debouncedValue
  };
}