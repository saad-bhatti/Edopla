/**************************************************************************************************
 * This file contains the UI for the not found page.                                              *
 * This page is used to display a message when a route is not found.                              *
 **************************************************************************************************/

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Stack from "@mui/joy/Stack";
import { SxProps } from "@mui/joy/styles/types";
import { SectionTitleText } from "../styles/Text";
import { minPageHeight } from "../styles/constants";

/** UI for the not found page. */
const NotFoundPage = () => {
  /** Sx for the not found page. */
  const customSx: SxProps = {
    margin: 0,
    minHeight: minPageHeight,
  };

  return (
    <Stack id="NotFoundPage" direction="row" justifyContent="center" gap={5} py={10} sx={customSx}>
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: "20vh" }} />
      <SectionTitleText>Page not found</SectionTitleText>
    </Stack>
  );
};

export default NotFoundPage;
