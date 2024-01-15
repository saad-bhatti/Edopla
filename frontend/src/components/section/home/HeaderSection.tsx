/**************************************************************************************************
 * This file contains the UI for the header section of the home page.                             *
 **************************************************************************************************/

import { Container, Stack } from "@mui/joy";
import {
  LargeBodyText,
  SectionTitleText,
  centerText,
  mobileScreenInnerWidth,
} from "../../../styles/TextSX";

/** UI for the HomePage's header section. */
const Header = () => {
  return (
    <Container
      id="Header"
      sx={(theme) => ({
        minWidth: "100%",
        minHeight: "80%",
        borderRadius: window.innerWidth <= mobileScreenInnerWidth ? 0 : "0 0 40% 40%",
        [theme.getColorSchemeSelector("dark")]: {
          background: "linear-gradient(to right, #280afe, #996bce)",
        },
      })}
    >
      <Stack direction="column" alignItems="center" gap={5} paddingY="10%">
        {/* Section title. */}
        <SectionTitleText children="Welcome to Edopla!" sx={centerText} />

        {/* Section content. */}
        <LargeBodyText
          children="Your cravings, our mission - order, pick up, enjoy!"
          fontSize="130%"
          sx={centerText}
        />
      </Stack>
    </Container>
  );
};

export default Header;
