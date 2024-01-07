/**************************************************************************************************
 * This file contains the UI for the home page.                                                   *
 * This page is used to display the general information and features of the application.          *
 **************************************************************************************************/

import Stack from "@mui/joy/Stack";
import { SxProps, Theme } from "@mui/joy/styles/types";
import CustomAnimation from "../../components/custom/CustomAnimation";
import { onlyBackgroundSx } from "../../styles/PageSX";
import About from "./About";
import Contact from "./Contact";
import Features from "./Features";
import Header from "./Header";
import Meet from "./Meet";

/** UI for the home page. */
const HomePage = () => {
  /** Sx for the home page. */
  const customSx: SxProps = (theme: Theme) => ({
    ...onlyBackgroundSx(theme),
  });

  /** UI layout for the home page. */
  return (
    <Stack id="HomePage" direction="column" gap={10} sx={customSx}>
      <CustomAnimation child={<Header />} transformAnimation="translateY(-5%)" />
      <CustomAnimation child={<Features />} transformAnimation="translateX(-5%)" />
      <CustomAnimation child={<About />} transformAnimation="translateX(-5%)" />
      <CustomAnimation child={<Meet />} transformAnimation="translateX(-5%)" />
      <CustomAnimation child={<Contact />} transformAnimation="translateY(5%)" />
    </Stack>
  );
};

export default HomePage;
