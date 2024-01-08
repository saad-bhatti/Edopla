/**************************************************************************************************
 * This file contains the UI for the forbidden page.                                              *
 * This page displays a message when a client lacks the authentication to access a route.         *
 **************************************************************************************************/

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Stack from "@mui/joy/Stack";
import { SxProps } from "@mui/joy/styles/types";
import { SectionTitleText } from "../styles/Text";
import { minPageHeight } from "../styles/constants";

/** UI for the forbidden page. */
const NotFoundPage = () => {
  /** Sx for the forbidden page. */
  const customSx: SxProps = {
    margin: 0,
    minHeight: minPageHeight,
  };

  return (
    <Stack id="ForbiddenPage" direction="row" justifyContent="center" gap={5} py={10} sx={customSx}>
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: "20vh" }} />
      <SectionTitleText>Forbidden.</SectionTitleText>
    </Stack>
  );
};

export default NotFoundPage;
