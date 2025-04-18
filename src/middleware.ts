import { NextResponse } from 'next/server';

export function middleware() {
  // Получаем текущий ответ
  const response = NextResponse.next();
  
  // Добавляем заголовки безопасности
  
  // Строгая политика безопасности контента
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com; frame-src https://www.youtube.com; img-src 'self' https://image.tmdb.org data:; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://api.themoviedb.org; frame-ancestors 'none';"
  );
  
  // Предотвращает перетаскивание фрейма на другие сайты
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Включает встроенную в браузер XSS-защиту
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Предотвращает MIME-sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Управление политикой рефереров
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Использовать HTTPS вместо HTTP
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // Блокируем запросы к Google Ads
  response.headers.set('Permissions-Policy', 'interest-cohort=()');

  return response;
}

// Определяем, для каких путей применяется middleware
export const config = {
  matcher: [
    // Применяем ко всем маршрутам, кроме статических ресурсов
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ],
};