export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${minutes} мин.`;
  }
  
  return `${hours} ч. ${remainingMinutes} мин.`;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0
  }).format(num);
}; 