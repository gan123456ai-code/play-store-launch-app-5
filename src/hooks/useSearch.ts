
import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export interface UseSearchResult<T> {
  query: string;
  setQuery: (query: string) => void;
  results: T[];
  isSearching: boolean;
  clearSearch: () => void;
  hasResults: boolean;
}

export function useSearch<T>(
  data: T[],
  searchFields: (keyof T)[],
  debounceMs: number = 300
): UseSearchResult<T> {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return data;
    const lowerQuery = debouncedQuery.toLowerCase();
    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowerQuery);
        }
        return false;
      })
    );
  }, [data, debouncedQuery, searchFields]);

  const clearSearch = useCallback(() => setQuery(''), []);

  return {
    query,
    setQuery,
    results,
    isSearching: query !== debouncedQuery,
    clearSearch,
    hasResults: results.length > 0,
  };
}
