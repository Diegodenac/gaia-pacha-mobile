import { useEffect, useState } from 'react';

/**
 * Hook: useDebounce
 * Returns a value that only updates after `delay` ms of stability.
 * Use it to throttle expensive effects (e.g. server queries) tied to a
 * fast-changing input like a TextInput.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
