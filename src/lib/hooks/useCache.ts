'use client';

import { useState, useEffect } from 'react';

interface CacheOptions {
  ttl?: number; // время жизни кеша в миллисекундах
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
        // Проверяем кеш
        const cached = localStorage.getItem(key);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          
          // Проверяем TTL
          if (!options.ttl || Date.now() - timestamp < options.ttl) {
            setData(cachedData);
            setIsLoading(false);
            return;
          }
        }

        // Если нет в кеше или истек TTL, загружаем
        const freshData = await fetcher();
        
        // Сохраняем в кеш
        localStorage.setItem(
          key,
          JSON.stringify({
            data: freshData,
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