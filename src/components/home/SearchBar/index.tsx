'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { ROUTES, SEARCH_DEBOUNCE_INTERVAL } from '@/lib/utils/constants';
import classNames from "classnames";

import { CloseIcon, SearchIcon } from '@/styles/icon'
import styles from "./styles.module.scss"


interface SearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  onSearch,
  autoFocus = false
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_INTERVAL);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);


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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchTerm);
    }
    else if (searchTerm.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form
      className={classNames(styles.searchContainer, {
        [styles.isFocused]: isFocused
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