export const convertWeekDay = (weekdays) => {
  const daysInKorean = {
    MON: '월',
    TUE: '화',
    WED: '수',
    THU: '목',
    FRI: '금',
    SAT: '토',
    SUN: '일',
  };
  const str = weekdays
    .split(',')
    .map((day) => daysInKorean[day])
    .join(', ');
  return str;
};
