/**************************************************************************************************
 * This file contains the UI for the about section of the home page.                              *
 **************************************************************************************************/

import { AspectRatio, Container, Stack } from "@mui/joy";
import logo from "../../../images/logo.png";
import { mobileScreenInnerWidth } from "../../../styles/StylingConstants";
import { LargeBodyText, SectionTitleText } from "../../../styles/TextSX";

/** UI for the HomePage's about section. */
const About = () => {
  const verticalPadding = "5%";
  return (
    <Container
      id="About"
      sx={(theme) => ({
        borderRadius: window.innerWidth <= mobileScreenInnerWidth ? 0 : "10%",
        [theme.getColorSchemeSelector("dark")]: {
          background: "linear-gradient(to right, #1e1e30, #172836)",
        },
      })}
    >
      {/* Section title. */}
      <SectionTitleText
        children="About Us"
        marginBottom={window.innerWidth <= mobileScreenInnerWidth ? verticalPadding : 0}
        paddingTop={window.innerWidth <= mobileScreenInnerWidth ? 0 : verticalPadding}
        sx={{ width: "fit-content", mx: "auto", borderBottom: "1vh solid" }}
      />

      {/* Section content. */}
      <Stack
        direction={window.innerWidth <= mobileScreenInnerWidth ? "column" : "row"}
        justifyContent="center"
        gap={5}
        padding={`${verticalPadding} 0%`}
      >
        {/* Section text. */}
        <LargeBodyText>
          Welcome to Edopla, where your cravings become our mission! At Edopla, we take pride in
          being more than just a food delivery platform; we are a community that connects local
          vendors and customers, fostering a vibrant local economy.
          <br />
          <br />
          Our platform serves as a bridge, linking local businesses directly to customers. By doing
          so, we empower local vendors, offering them a larger share of the sale revenue compared to
          our competitors. We believe in supporting the backbone of our communities, and Edopla is
          dedicated to ensuring that local businesses thrive.
          <br />
          <br />
          For our valued customers, Edopla goes beyond convenience; it's about affordability. We
          charge a minimal service fee, allowing you to enjoy your favorite meals without breaking
          the bank. Your satisfaction is at the heart of our mission, and we strive to make your
          dining experience not only delicious but also accessible.
          <br />
          <br />
          Join us on this journey as we revolutionize the way you discover and enjoy local flavors.
          Order, pick up, and savor the taste of community with Edopla!
        </LargeBodyText>

        {/* Section image. */}
        <AspectRatio
          ratio="1"
          variant="outlined"
          objectFit="fill"
          sx={{
            minWidth: "25%",
            borderRadius: "md",
            marginY: "auto",
          }}
        >
          <img src={logo} alt="logo" />
        </AspectRatio>
      </Stack>
    </Container>
  );
};

export default About;
