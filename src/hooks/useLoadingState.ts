
import { useState, useCallback } from 'react';

interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  page: number;
}

export function useLoadingState<T>(initialData: T | null = null) {
  const [state, setState] = useState<LoadingState<T>>({
    data: initialData,
    loading: false,
    error: null,
    refreshing: false,
    loadingMore: false,
    hasMore: true,
    page: 1,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, loading: false, refreshing: false, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false, refreshing: false }));
  }, []);

  const setRefreshing = useCallback((refreshing: boolean) => {
    setState(prev => ({ ...prev, refreshing }));
  }, []);

  const setLoadingMore = useCallback((loadingMore: boolean) => {
    setState(prev => ({ ...prev, loadingMore }));
  }, []);

  const setHasMore = useCallback((hasMore: boolean) => {
    setState(prev => ({ ...prev, hasMore }));
  }, []);

  const nextPage = useCallback(() => {
    setState(prev => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null, refreshing: false, loadingMore: false, hasMore: true, page: 1 });
  }, [initialData]);

  const simulateLoad = useCallback((getData: () => T, delay: number = 1500) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    setTimeout(() => {
      try {
        const data = getData();
        setState(prev => ({ ...prev, data, loading: false }));
      } catch (e) {
        setState(prev => ({ ...prev, error: 'Failed to load data', loading: false }));
      }
    }, delay);
  }, []);

  const simulateRefresh = useCallback((getData: () => T, delay: number = 1000) => {
    setState(prev => ({ ...prev, refreshing: true }));
    setTimeout(() => {
      try {
        const data = getData();
        setState(prev => ({ ...prev, data, refreshing: false, page: 1 }));
      } catch (e) {
        setState(prev => ({ ...prev, refreshing: false }));
      }
    }, delay);
  }, []);

  return {
    ...state,
    setLoading,
    setData,
    setError,
    setRefreshing,
    setLoadingMore,
    setHasMore,
    nextPage,
    reset,
    simulateLoad,
    simulateRefresh,
  };
}
