/**************************************************************************************************
 * This file contains the function to format a date from a string to "Jan 1, 2021, 12:00 AM".     *
 **************************************************************************************************/

/** Format date from string to "Jan 1, 2021, 12:00 AM". */
export function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
