import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Container, IconButton } from "@mui/joy";
import Badge from "@mui/joy/Badge";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import { useContext } from "react";
import { Link } from "react-router-dom";
import * as Context from "../../utils/contexts";
import CustomSearch from "../custom/CustomSearch";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { NavBarLoggedInHead, NavBarLoggedInTail } from "./NavBarLoggedInView";
import { NavBarLoggedOutHead, NavBarLoggedOutTail } from "./NavBarLoggedOutView";

/** UI component for a custom navigation. */
const NavBar = () => {
  // Retrieve the logged in user from the context
  const { loggedInUser } =
    useContext<Context.LoggedInUserContextProps | null>(Context.LoggedInUserContext) || {};
  // Retrieve the logged in user's cart from the context
  const { carts } = useContext<Context.CartsContextProps | null>(Context.CartsContext) || {};

  /** UI layout for the custom navigation. */
  return (
    <Container id="Navbar" style={{ padding: 2 }} sx={{ minWidth: "100%" }}>
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
              href="/"
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

          {/* Cart button. */}
          <Link to="/carts">
            <IconButton variant="plain" color="neutral" size="sm" sx={{ alignSelf: "center" }}>
              <Badge badgeContent={carts?.length} size="sm">
                <ShoppingCartIcon sx={{ fontSize: "large" }} />
              </Badge>
            </IconButton>
          </Link>

          {/* Rest of tail depending in authentication status. */}
          {loggedInUser ? <NavBarLoggedInTail /> : <NavBarLoggedOutTail />}
        </Stack>
      </Box>
    </Container>
  );
};

export default NavBar;
