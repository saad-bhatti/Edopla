import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Container, Stack } from "@mui/joy";
import { ReactElement, cloneElement } from "react";
import { LargeBodyText, SectionTitleText, SubSectionTitleText } from "./Styling";

/** UI for the HomePage's features section. */
const Features = () => {
  /** Generates a feature component. */
  function generateFeature(
    icon: ReactElement,
    title: string,
    description: string,
    background: string
  ): ReactElement {
    return (
      <Container
        sx={(theme) => ({
          borderRadius: "10%",
          padding: "5%",
          [theme.getColorSchemeSelector("dark")]: {
            background: "#202328",
          },
        })}
      >
        <Stack direction="column" alignItems="center" gap={2}>
          {/* Feature icon. */}
          {cloneElement(icon, {
            sx: {
              fontSize: "8vh",
              border: "1px solid",
              borderRadius: "3vh",
              color: "#ffffff",
              background: background,
            },
          })}
          {/* Feature title. */}
          <SubSectionTitleText children={title} fontFamily="cursive" />
          {/* Feature description. */}
          <LargeBodyText children={description} sx={{ textAlign: "center" }} />
        </Stack>
      </Container>
    );
  }

  const buyFeature = generateFeature(
    <ShoppingBagIcon />,
    "Buy",
    "Effortlessly sell products, reaching a wider audience",
    "#864dc7"
  );

  const userFeature = generateFeature(
    <PersonIcon />,
    "User",
    "Personalized experiences, with a focus on the you",
    "#047ccd"
  );

  const sellFeature = generateFeature(
    <StorefrontIcon />,
    "Sell",
    "Connect with local vendors, and buy with confidence.",
    "#5c983b"
  );

  return (
    <Container
      id="Features"
      sx={(theme) => ({
        borderRadius: "10%",
        [theme.getColorSchemeSelector("dark")]: {
          background: "#161b22",
        },
      })}
    >
      <Stack direction="column" alignItems="center" gap="8vh" p="5%">
        {/* Section title. */}
        <SectionTitleText children="Features" sx={{ borderBottom: "2vh solid" }} />

        {/* Section content. */}
        <Stack direction="row" alignItems="center" gap="5vw">
          {/* Feature 1. */}
          {buyFeature}
          {/* Feature 2. */}
          {userFeature}
          {/* Feature 3. */}
          {sellFeature}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Features;
