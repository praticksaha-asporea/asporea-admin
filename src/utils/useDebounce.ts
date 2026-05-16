import { useState, useEffect } from "react";

/**
 * Returns a debounced copy of `value` that only updates
 * after `delay` ms of no changes. Use the debounced value
 * as a useEffect/useCallback dependency instead of the raw input.
 */
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
