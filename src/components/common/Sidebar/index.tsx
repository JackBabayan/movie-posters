'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Genre } from '@/types';
import { tmdbApi, SWR_KEYS } from '@/lib/api/tmdb';
import classNames from "classnames";

import { ClearIcon } from '@/styles/icon'

import styles from "./styles.module.scss"

interface SidebarProps {
  selectedGenres: number[];
  onGenreSelect: (genreId: number) => void;
  onClearGenres: () => void;
}

const fetcher = () => tmdbApi.getGenres();

export const Sidebar: React.FC<SidebarProps> = ({
  selectedGenres,
  onGenreSelect,
  onClearGenres
}) => {
  const { data, error, isLoading } = useSWR(SWR_KEYS.genres, fetcher);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    if (data?.genres) {
      setGenres(data.genres);
    }
  }, [data]);


  const handleGenreClick = (genreId: number) => {
    onGenreSelect(genreId);
  };

  const isGenreSelected = (genreId: number) => {
    return selectedGenres.includes(genreId);
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.sidebarWrapper}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3 className={styles.title}>Жанры</h3>

            {selectedGenres.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className={styles.sidebarClearBtn}
                onClick={onClearGenres}
                aria-label="Очистить выбранные жанры"
              >
                <ClearIcon />
              </motion.button>
            )}
          </div>

          {!isLoading &&
            error ? (
            <div>
              <p>Не удалось загрузить жанры</p>
            </div>
          ) : (
            <ul className={styles.sidebarList}>
              {genres.map((genre) => (
                <li key={genre.id}
                  className={styles.sidebarItem}
                  onClick={() => handleGenreClick(genre.id)}
                >
                  <span className={classNames(styles.sidebarItemContent, {
                    [styles.active]: isGenreSelected(genre.id)
                  })}>
                    {genre.name}
                  </span>

                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};