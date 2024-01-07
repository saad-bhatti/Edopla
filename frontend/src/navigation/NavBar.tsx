/**************************************************************************************************
 * This file contains the UI for the navigation bar.                                              *
 * The navigation bar allows the user to navigate through the application.                        *
 **************************************************************************************************/

import { Container } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import { SxProps, Theme } from "@mui/joy/styles/types";
import { useContext } from "react";
import { Link } from "react-router-dom";
import CustomSearch from "../components/custom/CustomSearch";
import { onlyBackgroundSx } from "../styles/PageSX";
import * as Constants from "../styles/constants";
import { LoggedInUserContext, LoggedInUserContextProps } from "../utils/contexts";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { NavBarLoggedInHead, NavBarLoggedInTail } from "./NavBarLoggedInView";
import { NavBarLoggedOutHead, NavBarLoggedOutTail } from "./NavBarLoggedOutView";

/** UI component for a custom navigation. */
const NavBar = () => {
  // Retrieve the logged in user from the context
  const { loggedInUser } = useContext<LoggedInUserContextProps | null>(LoggedInUserContext) || {};
  /** Sx for the navigation bar. */
  const customSx: SxProps = (theme: Theme) => ({
    ...onlyBackgroundSx(theme),
    minWidth: Constants.minPageWidth,
    maxHeight: Constants.navBarMaxWidth,
  });

  /** UI layout for the custom navigation. */
  return (
    <Container id="Navbar" style={{ padding: 0 }} sx={customSx}>
      {/* Navigation bar head. */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          border: "0.5px solid",
          borderRadius: "5px",
          padding: "5px 0px",
        }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          {/* Home button. */}
          <Link to="/">
            <Button
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ alignSelf: "center", fontSize: "md" }}
            >
              Edopla
            </Button>
          </Link>

          {/* Rest of head depending in authentication status. */}
          {loggedInUser ? <NavBarLoggedInHead /> : <NavBarLoggedOutHead />}
        </Stack>

        {/* Navigation bar tail. */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          {/* Search bar. */}
          <CustomSearch
            placeholder="Type to search"
            initialValue=""
            activeSearch={false}
            onSearch={() => {}}
          />

          {/* Color scheme toggle. */}
          <ColorSchemeToggle />

          {/* Rest of tail depending in authentication status. */}
          {loggedInUser ? <NavBarLoggedInTail /> : <NavBarLoggedOutTail />}
        </Stack>
      </Box>
    </Container>
  );
};

export default NavBar;
