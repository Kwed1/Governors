export const abbreviateNumber = (value: number): string => {
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  // Если число меньше 1000, вернуть его как есть, иначе округлить до двух знаков
  const roundedValue = suffixIndex === 0 ? value : value.toFixed(2);

  return roundedValue + suffixes[suffixIndex];
};
