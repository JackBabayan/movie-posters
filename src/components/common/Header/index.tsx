'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { ROUTES } from '@/lib/utils/constants';
import classNames from 'classnames';

import styles from './styles.module.scss'

export const Header: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };


  return (
    <header className={styles.header}>
      <div className={styles.headerWrap}>
        <Link href={ROUTES.HOME} className={styles.headerLogo}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/image/Logo.png"
              alt="Logo"
              width={70}
              height={80}
              className={styles.logo}
            />
          </motion.div>
        </Link>


        <ul className={styles.navList}>
          <li className={classNames(styles.navItem, {
            [styles.active]: isActive(ROUTES.HOME)
          })}>
            <Link
              href={ROUTES.HOME}>
              Главная
            </Link>
          </li>
          <li className={classNames(styles.navItem, {
            [styles.active]: isActive(ROUTES.FAVORITES)
          })}>
            <Link
              href={ROUTES.FAVORITES}
            >
              Избранное
            </Link>
          </li>
        </ul>

        <ThemeSwitcher />

      </div>

    </header>
  );
};