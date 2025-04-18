export const formatDate = (
  dateString: string | null | undefined,
  locale: string = 'ru-RU'
): string => {
  if (!dateString) return 'Дата неизвестна';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Некорректная дата';
    }
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return 'Ошибка формата даты';
  }
};


export const formatRuntime = (minutes: number | null | undefined): string => {
  if (!minutes || minutes <= 0) return 'Неизвестно';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours} ч ${remainingMinutes > 0 ? `${remainingMinutes} мин` : ''}`;
  }
  
  return `${minutes} мин`;
};


export const formatNumber = (
  value: number | null | undefined,
  locale: string = 'ru-RU'
): string => {
  if (value === null || value === undefined || value === 0) {
    return 'Неизвестно';
  }
  
  return new Intl.NumberFormat(locale).format(value);
};