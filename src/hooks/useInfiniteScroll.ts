
import { useState, useCallback, useRef } from 'react';

export interface UseInfiniteScrollResult<T> {
  data: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  refreshing: boolean;
}

export function useInfiniteScroll<T>(
  fetchFn: (page: number, pageSize: number) => Promise<T[]>,
  pageSize: number = 20
): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newItems = await fetchFn(pageRef.current, pageSize);
      if (newItems.length < pageSize) setHasMore(false);
      setData(prev => [...prev, ...newItems]);
      pageRef.current += 1;
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, fetchFn, pageSize]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    pageRef.current = 1;
    setHasMore(true);
    try {
      const newItems = await fetchFn(1, pageSize);
      if (newItems.length < pageSize) setHasMore(false);
      setData(newItems);
      pageRef.current = 2;
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchFn, pageSize]);

  return { data, loading, hasMore, loadMore, refresh, refreshing };
}
