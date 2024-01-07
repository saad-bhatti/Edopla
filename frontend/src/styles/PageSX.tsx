/**************************************************************************************************
 * This file contains the styling for the pages within the application.                           *
 **************************************************************************************************/

import { Theme } from "@mui/joy/styles/";

/** SX that has no affect on the page's background. */
export const simpleSx = {
  padding: "1% 0%",
  margin: "0% 5%",
};

/** SX that only affects the page's background. */
export const onlyBackgroundSx = (theme: Theme) => ({
  [theme.getColorSchemeSelector("light")]: {
    background: "linear-gradient(to right, #dcdcdc, #ffffff)",
  },
  [theme.getColorSchemeSelector("dark")]: {
    background: "linear-gradient(to right, #010001, #020944)",
  },
});

/** SX that has an affect on the page's background along with other styling affects. */
export const withBackgroundSx = (theme: Theme) => ({
  padding: "1% 0%",
  margin: "0% 5%",
  [theme.getColorSchemeSelector("light")]: {
    background: "linear-gradient(to right, #dcdcdc, #ffffff)",
  },
  [theme.getColorSchemeSelector("dark")]: {
    background: "linear-gradient(to right, #010001, #020944)",
  },
});
