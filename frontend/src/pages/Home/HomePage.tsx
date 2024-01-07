/**************************************************************************************************
 * This file contains the UI for the home page.                                                   *
 * This page is used to display the general information and features of the application.          *
 **************************************************************************************************/

import Stack from "@mui/joy/Stack";
import CustomAnimation from "../../components/custom/CustomAnimation";
import About from "./About";
import Contact from "./Contact";
import Features from "./Features";
import Header from "./Header";
import Meet from "./Meet";

/** UI for the home page. */
const HomePage = () => {
  /** UI layout for the home page. */
  return (
    <Stack
      id="HomePage"
      direction="column"
      gap={10}
      sx={(theme) => ({
        margin: 0,
        [theme.getColorSchemeSelector("light")]: {
          background: "linear-gradient(to right, #dcdcdc, #ffffff)",
        },
        [theme.getColorSchemeSelector("dark")]: {
          background: "linear-gradient(to right, #010001, #020944)",
        },
      })}
    >
      <CustomAnimation child={<Header />} transformAnimation="translateY(-5%)" />
      <CustomAnimation child={<Features />} />
      <CustomAnimation child={<About />} transformAnimation="translateX(-5%)" />
      <CustomAnimation child={<Meet />} transformAnimation="translateX(5%)" />
      <CustomAnimation child={<Contact />} transformAnimation="translateY(5%)" />
    </Stack>
  );
};

export default HomePage;
