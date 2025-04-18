'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { AttentionIcon } from '@/styles/icon'

import styles from "./styles.module.scss"

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, retry }) => {
  return (
    <motion.div
      className={styles.errorMessage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >

      <AttentionIcon />

      <div className={styles.errorMessageText}>{message}</div>
      {retry && (
        <button
          className={styles.errorMessageBtn}
          onClick={retry}
          aria-label="Повторить попытку"
        >
          Повторить
        </button>
      )}
    </motion.div>
  );
};