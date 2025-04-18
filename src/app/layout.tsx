import React from 'react';
import { SWRConfig } from 'swr';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { StoreProvider } from '@/lib/providers/StoreProvider';
import '@/styles/global.scss';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" className='dark'>
      <head>
        <title>PopМovie - Каталог фильмов на вечер</title>
        <meta name="description" content="Каталог фильмов с возможностью поиска, фильтрации и сохранения в избранное" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/image/favicon.ico" />
        <link rel="icon" href="/image/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/image/favicon-32x32.png" sizes="32x32" type="image/png" />
      </head>
      <body>
        <StoreProvider>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
              dedupingInterval: 0
            }}
          >
            <Header />
            <main className='mainContainer'>
              <section className='mainWrap'>
                {children}
              </section>
              <div className='circle'></div>
            </main>
            <Footer />
          </SWRConfig>
        </StoreProvider>
      </body>
    </html>
  );
}