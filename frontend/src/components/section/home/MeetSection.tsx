/**************************************************************************************************
 * This file contains the UI for the meet section of the home page.                               *
 **************************************************************************************************/

import { AspectRatio, Container, Stack } from "@mui/joy";
import developerImg from "../../../images/developer.jpg";
import { mobileScreenInnerWidth } from "../../../styles/StylingConstants";
import { LargeBodyText, SectionTitleText } from "../../../styles/Text";

/** UI for the HomePage's meet section. */
const Meet = () => {
  const verticalPadding = "5%";
  return (
    <Container
      id="Meet"
      sx={(theme) => ({
        borderRadius: window.innerWidth <= mobileScreenInnerWidth ? 0 : "10%",
        [theme.getColorSchemeSelector("dark")]: {
          background: "linear-gradient(to right, #1e1e30, #172836)",
        },
      })}
    >
      {/* Section title. */}
      <SectionTitleText
        children="Meet the Developer"
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
        {/* Section image. */}
        <AspectRatio
          ratio="6/5"
          variant="outlined"
          objectFit="fill"
          sx={{
            minWidth: "25%",
            borderRadius: "md",
            marginY: "auto",
          }}
        >
          <img src={developerImg} alt="dev" />
        </AspectRatio>

        {/* Section text. */}
        <LargeBodyText>
          Saad Mohy-Uddin Bhatti is the creative mind and passionate developer behind Edopla. As a
          recent graduate from the University of Toronto, he brings a wealth of knowledge and skills
          to the table, honed over four years of immersive learning and hands-on experience in
          various domains of software development. His journey in the tech world has been diverse,
          covering everything from fundamentals to the art of crafting seamless UI/UX experiences.
          Full-stack development is not just a skill; it's a way of thinking, and it's what he loves
          to do.
          <br />
          <br />
          Saad is not just building Edopla; he's actively working on his own side projects, pushing
          boundaries, and always seeking opportunities to grow and innovate. It's not just about
          keeping up with the latest trends; it's about staying ahead and shaping the future of
          technology.
          <br />
          <br />
          Outside the world of code, you'll find Saad cherishing moments with friends and family,
          diving into story-rich video games, and exploring the richness of different cultures
          across the globe. He believes in a holistic approach to life, blending the precision of
          code with the joys of human connection.
          <br />
          <br />
          Saad loves helping others learn and grow, and looks forward to bringing the vision of
          Edopla to life. Please feel free to reach out to him using the contact information below.
        </LargeBodyText>
      </Stack>
    </Container>
  );
};

export default Meet;
