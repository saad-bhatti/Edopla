/**************************************************************************************************
 * This file contains the UI for the contact section of the home page.                            *
 **************************************************************************************************/

import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import { Container, Stack } from "@mui/joy";
import {
  LargeBodyText,
  SectionTitleText,
  centerText,
  mobileScreenInnerWidth,
} from "../../../styles/TextSX";

/** UI for the HomePage's contact section. */
const Contact = () => {
  return (
    <Container
      id="Contact"
      sx={(theme) => ({
        minWidth: "100%",
        minHeight: "80%",
        borderRadius: window.innerWidth <= mobileScreenInnerWidth ? 0 : "0 0 40% 40%",
        [theme.getColorSchemeSelector("dark")]: {
          background: "linear-gradient(to right, #280afe, #996bce)",
        },
      })}
    >
      <Stack direction="column" alignItems="center" gap={5} paddingY="5%">
        {/* Section title. */}
        <SectionTitleText children="Contact Us" sx={centerText} />

        {/* Description section. */}

        {/* Email section. */}
        <LargeBodyText
          children="saad.bhatti.cs@gmail.com"
          startDecorator={<EmailIcon />}
          sx={centerText}
        />

        {/* Number section. */}
        <LargeBodyText
          children="+1 (781) 692-9561"
          startDecorator={<PhoneIcon />}
          sx={centerText}
        />

        {/* LinkedIn section. */}
        <LargeBodyText
          children="https://www.linkedin.com/in/saad-bhatti/"
          startDecorator={<LinkedInIcon />}
          sx={centerText}
        />
      </Stack>
    </Container>
  );
};

export default Contact;
