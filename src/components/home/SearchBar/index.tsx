'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { SEARCH_DEBOUNCE_INTERVAL } from '@/lib/utils/constants';
import classNames from 'classnames';

import { CloseIcon, SearchIcon } from '@/styles/icon';
import styles from './styles.module.scss';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  autoFocus = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = useMemo(() => searchParams.get('q') || '', [searchParams]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_INTERVAL);

  const updateSearch = useCallback(
    (term: string) => {
      if (onSearch) {
        onSearch(term);
      } else {
        const params = new URLSearchParams(searchParams.toString());
        if (term.trim()) {
          params.set('q', term.trim());
        } else {
          params.delete('q');
        }
        router.push(`/?${params.toString()}`);
      }
    },
    [onSearch, router, searchParams]
  );

  useEffect(() => {
    updateSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, updateSearch]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      className={classNames(styles.searchContainer, {
        [styles.isFocused]: isFocused,
      })}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        className={styles.input}
        placeholder="Поиск фильмов..."
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Поиск фильмов"
      />

      <AnimatePresence>
        {searchTerm && (
          <motion.button
            className={styles.clear}
            onClick={handleClearSearch}
            type="button"
            aria-label="Очистить поиск"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 23 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CloseIcon />
          </motion.button>
        )}
      </AnimatePresence>

      <button type="submit" className={styles.searchBtn}>
        <SearchIcon />
      </button>
    </form>
  );
};



// SearchBar
// Назначение: Поиск фильмов по названию.
// Технологии:
// useDebounce для оптимизации запросов
// URL Search Params для сохранения состояния
// CSS анимации для интерактивности
// Принцип работы:
// Отслеживает ввод пользователя
// Применяет debounce к поисковым запросам
// Обновляет URL с параметрами поиска
// Поддерживает очистку поля
// Анимирует состояния фокуса