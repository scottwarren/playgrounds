import leftPad from 'left-pad';

// This method doesn't take into account multiple languages nor multiple input formats
const monthMap = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDay(unformattedDay: string) {
  const dayIndex = parseInt(unformattedDay.replace(/[a-zA-Z]/g, ''), 10);

  return leftPad(dayIndex, 2, '0');
}

function formatMonth(unformattedMonth: string) {
  // indexOf is 0 index based, we want the month number starting at 1 instead
  const monthIndex = monthMap.indexOf(unformattedMonth) + 1;

  return leftPad(monthIndex, 2, '0');
}

function formatYear(unformattedYear: string) {
  return unformattedYear;
}

export function dateParser(dates: string[]): string[] {
  return dates.map(date => {
    const [day, month, year] = date.split(' ');

    const formattedDay = formatDay(day);
    const formattedMonth = formatMonth(month);
    const formattedYear = formatYear(year);

    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  });
}
