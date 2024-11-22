export function formatDateString(dateStr: string): string {
  try {
      const [date, timeWithOffset] = dateStr.split(' ');
      const time = timeWithOffset.includes('+')
          ? timeWithOffset.split('+')[0]
          : timeWithOffset;

      const timeParts = time.split(':');
      const formattedTime = `${timeParts[0]}:${timeParts[1]}`;

      return `${date} ${formattedTime}`;
  } catch (error) {
      throw new Error(`Error formatting date string: ${error}`);
  }
}
