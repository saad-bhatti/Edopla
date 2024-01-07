/**************************************************************************************************
 * This file contains the UI for the not found page.                                              *
 * This page is used to display a message when a route is not found.                              *
 **************************************************************************************************/

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Stack from "@mui/joy/Stack";
import { SectionTitleText } from "../styles/Text";

/** Page to be loaded when a route is not found. */
const NotFoundPage = () => {
  return (
    <Stack id="NotFoundPage" direction="row" justifyContent="center" gap={5} py={10}>
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: "20vh" }} />
      <SectionTitleText>Page not found</SectionTitleText>
    </Stack>
  );
};

export default NotFoundPage;
