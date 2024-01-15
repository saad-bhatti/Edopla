/**************************************************************************************************
 * This file contains the UI for the side image section of the authentication-related pages.      *
 **************************************************************************************************/

import { Container } from "@mui/joy";
import { mobileScreenInnerWidth } from "../../../styles/StylingConstants";

/** UI for the side image section. */
const SideImageSection = () => {
  /** UI layout for the side image section. */
  return (
    <Container
      sx={(theme) => ({
        p: 0,
        m: 0,
        display: window.innerWidth <= mobileScreenInnerWidth ? "none" : "flex",
        [theme.getColorSchemeSelector("light")]: {
          backgroundImage:
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
        },

        [theme.getColorSchemeSelector("dark")]: {
          backgroundImage:
            "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
        },
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "6px",
      })}
    />
  );
};

export default SideImageSection;
