import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function usePersistedState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? { ...initialValue, ...JSON.parse(stored) } : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage unavailable (private browsing, quota, etc.) — fail silently.
    }
  }, [key, state]);

  const clear = () => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setState(initialValue);
  };

  return [state, setState, clear];
}
