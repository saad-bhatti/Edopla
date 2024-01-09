/**************************************************************************************************
 * This file exports a function to display an error in the console, if the DEBUG environment      *
 * variable is set to true.                                                                       *
 **************************************************************************************************/

const { REACT_APP_DEBUG } = process.env;
const DEBUG = REACT_APP_DEBUG === "true";

/**
 * Displays an error in the console, if the DEBUG environment variable is set to true.
 * @param error The error to display.
 */
export const displayError = (error: any): void => {
  if (DEBUG) console.error(error);
};
