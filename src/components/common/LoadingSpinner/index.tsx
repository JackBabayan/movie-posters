'use client';

import React from 'react';
import styles from "./styles.module.scss"

export const LoadingSpinner= () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <span>Загрузка...</span>
    </div>
  );
};