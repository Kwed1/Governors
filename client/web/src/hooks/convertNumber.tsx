export const abbreviateNumber = (value: number): string => {
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  // Всегда округляем до 2 знаков после запятой, если дробная часть есть
  const roundedValue =
    suffixIndex === 0
      ? parseFloat(value.toFixed(2))
      : parseFloat(value.toFixed(2));

  // Формируем строку с соответствующим суффиксом
  return `${roundedValue}${suffixes[suffixIndex]}`;
};
