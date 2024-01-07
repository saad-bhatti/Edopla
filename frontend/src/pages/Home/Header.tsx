import { Container, Stack } from "@mui/joy";
import { LargeBodyText, SectionTitleText } from "./Styling";

/** UI for the HomePage's header section. */
const Header = () => {
  return (
    <Container
      id="Header"
      sx={(theme) => ({
        minWidth: "100vw",
        maxHeight: "80vh",
        borderRadius: "0 0 40% 40%",
        [theme.getColorSchemeSelector("dark")]: {
          background: "linear-gradient(to right, #280afe, #996bce)",
        },
      })}
    >
      <Stack direction="column" alignItems="center" gap={5} paddingY="10%">
        {/* Section title. */}
        <SectionTitleText children="Welcome to Edopla!" />

        {/* Section content. */}
        <LargeBodyText
          children="Your cravings, our mission - order, pick up, enjoy!"
          fontSize="3vh"
        />
      </Stack>
    </Container>
  );
};

export default Header;
