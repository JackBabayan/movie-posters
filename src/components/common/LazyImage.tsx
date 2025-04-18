'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface LazyImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  withFade?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({ withFade = true, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AnimatePresence>
        {isLoading && withFade && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'var(--card-bg)',
              borderRadius: 'inherit',
            }}
          />
        )}
      </AnimatePresence>
      <Image
        {...props}
        onLoadingComplete={() => setIsLoading(false)}
        style={{
          ...props.style,
          opacity: withFade ? (isLoading ? 0 : 1) : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}; 