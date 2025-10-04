// src/hooks/useLocalStorage.js
import { useEffect, useState } from "react";

/**
 * En robust localStorage-hook som:
 * - fungerar i SSR (kollar window/localStorage),
 * - fångar och loggar fel istället för tomma catch-block,
 * - faller tillbaka till initialValue på fel.
 */
export function useLocalStorage(key, initialValue) {
  const isBrowser =
    typeof window !== "undefined" && typeof window.localStorage !== "undefined";

  const getInitial = () => {
    const fallback = typeof initialValue === "function" ? initialValue() : initialValue;
    if (!isBrowser) return fallback;

    try {
      const saved = window.localStorage.getItem(key);
      return saved != null ? JSON.parse(saved) : fallback;
    } catch (err) {
      // Kan hända vid t.ex. korrupt JSON eller blockerad storage (Safari privatläge)
      console.warn(`[useLocalStorage] kunde inte läsa nyckel "${key}":`, err);
      return fallback;
    }
  };

  const [value, setValue] = useState(getInitial);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Kan hända om kvoten är full eller om storage är blockerat
      console.warn(`[useLocalStorage] kunde inte skriva nyckel "${key}":`, err);
    }
  }, [isBrowser, key, value]);

  return [value, setValue];
}