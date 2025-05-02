'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  initialPage?: number;
}

export function useInfiniteScroll(
  callback: (page: number) => Promise<void>,
  options: UseInfiniteScrollOptions = {},
) {
  const { threshold = 200, initialPage = 1 } = options;
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        setLoading(true);
        try {
          await callback(page);
          setPage((prevPage) => prevPage + 1);
        } catch (error) {
          console.error('Ошибка загрузки контента:', error);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      }
    },
    [callback, page, hasMore, loading],
  );

  useEffect(() => {
    if (loading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleObserver, threshold, loading]);

  const resetPage = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
  }, [initialPage]);

  return { page, loading, hasMore, loaderRef, resetPage, setHasMore };
}
