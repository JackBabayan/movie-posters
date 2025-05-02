'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AttentionIcon } from '@/styles/icon'

import styles from "./styles.module.scss"

interface InfoMessageProps {
  message: string;
  link?: string;
  linkText?: string;
  retry?: () => void;
}

export const InfoMessage: React.FC<InfoMessageProps> = ({ message, retry, link, linkText }) => {
  return (
    <motion.div
      className={styles.InfoMessage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >

      <AttentionIcon />

      <div className={styles.InfoMessageText}>{message}</div>
      {retry && (
        <button
          className={'btnGlobal'}
          onClick={retry}
          aria-label="Повторить попытку"
        >
          Повторить
        </button>
      )}

      {
        link && linkText && (
          <Link href={link} className={'btnGlobal'}>
            {linkText}
          </Link>
        )
      }
    </motion.div>
  );
};


// Технологии:
// - CSS Modules для стилей
// - Next/Link для навигации

// Особенности:
// - Кастомизируемые сообщения
// - Опциональная кнопка действия
// - Адаптивный дизайн