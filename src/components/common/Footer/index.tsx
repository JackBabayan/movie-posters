'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/utils/constants';

import styles from "./styles.module.scss"

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <motion.div 
            className="footer__logo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={ROUTES.HOME}>
              <span className="footer__logo-text">MovieFlix</span>
            </Link>
            <p className="footer__logo-tagline">
              Ваш источник информации о фильмах
            </p>
          </motion.div>
          
          <nav className="footer__nav">
            <ul className="footer__nav-list">
              <motion.li 
                className="footer__nav-item" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link href={ROUTES.HOME} className="footer__nav-link">
                  Главная
                </Link>
              </motion.li>
              <motion.li 
                className="footer__nav-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Link href={ROUTES.FAVORITES} className="footer__nav-link">
                  Избранное
                </Link>
              </motion.li>
              <motion.li 
                className="footer__nav-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <a 
                  href="https://www.themoviedb.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__nav-link footer__nav-link--external"
                >
                  TMDb API
                </a>
              </motion.li>
            </ul>
          </nav>
        </div>
        
        <motion.div 
          className="footer__bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <p className="footer__copyright">
            &copy; {currentYear} MovieFlix. Все права защищены.
          </p>
          <p className="footer__tmdb-attribution">
            Данные предоставлены 
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__tmdb-link"
            >
              TMDb
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};