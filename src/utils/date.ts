/**
 * Represents the possible days when a week can start.
 */
export type WeekStartDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

/**
 * Calculates the current week number of the year based on a specified week start day.
 *
 * The function considers a week to be started as soon as the specified start day has passed.
 * For example, if weeks start on Wednesday and today is Thursday, you're already in the next week.
 *
 * @param weekStartsOn - The day that should be considered as the start of the week (default: 'wednesday')
 * @returns The current week number (1-53)
 *
 * @example
 * // If today is Thursday, October 24, 2024:
 * getCurrentWeekNumber('wednesday') // returns 44 (because Wednesday passed, so new week started)
 * getCurrentWeekNumber('monday')    // returns 43 (because we're in the middle of a Monday-based week)
 * getCurrentWeekNumber('sunday')    // returns 43 (because we're in the middle of a Sunday-based week)
 */
export function getCurrentWeekNumber(weekStartsOn: WeekStartDay = 'wednesday'): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const dayMap: Record<WeekStartDay, number> = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
    };

    const daysSinceStartOfYear = Math.floor(
        (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );

    const currentDay = now.getDay();
    const daysIntoWeek = (currentDay - dayMap[weekStartsOn] + 7) % 7;

    return Math.floor((daysSinceStartOfYear + (7 - daysIntoWeek)) / 7) + 1;
}

// Example usage:
// const thisWeek = getCurrentWeekNumber('wednesday');  // If using Wednesday as week start
// const standardWeek = getCurrentWeekNumber('monday'); // If using standard week