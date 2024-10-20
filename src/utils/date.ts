export function getCurrentWeekNumber(): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekDay = (now.getDay() + 4) % 7; // Week starts on Wednesday
    return Math.floor((days + weekDay) / 7) + 1;
}