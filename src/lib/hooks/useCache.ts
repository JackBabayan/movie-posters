'use client';

import { useState, useEffect } from 'react';

interface CacheOptions {
  ttl?: number;
}

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const cached = localStorage.getItem(key);
        if (cached) {
          const { value, timestamp } = JSON.parse(cached);
          
       
          if (!options.ttl || Date.now() - timestamp < options.ttl) {
            setData(value);
            setIsLoading(false);
            return;
          }
        }
        
        const freshData = await fetcher();
        
        localStorage.setItem(
          key,
          JSON.stringify({
            value: freshData,
            timestamp: Date.now(),
          })
        );

        setData(freshData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, options.ttl]);

  return { data, error, isLoading };
} 