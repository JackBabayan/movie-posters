'use client';

import React from 'react';

import styles from "./styles.module.scss"

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div
        className={styles.container}
      >
        <div className={styles.text}>
          &copy; {currentYear} PopMovie. Все права защищены.
        </div>
        <div className={styles.text}>
          Данные предоставлены
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TMDb
          </a>
        </div>
      </div>

    </footer>
  );
};