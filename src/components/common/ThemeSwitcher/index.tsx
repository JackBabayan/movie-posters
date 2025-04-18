'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/store/theme';
import { DarkIcon, LightIcon } from '@/styles/icon';

import styles from './styles.module.scss';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className={styles.switcher}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      initial={{ scale: 1 }}
      animate={{ rotate: theme === 'dark' ? 40 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {theme === 'dark' ? (
       <DarkIcon/>
       ) : (
        <LightIcon/>
      )}
    </motion.button>
  );
};