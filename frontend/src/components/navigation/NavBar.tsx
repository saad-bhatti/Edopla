import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { IconButton } from "@mui/joy";
import Badge from "@mui/joy/Badge";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import { useContext } from "react";
import { Link } from "react-router-dom";
import * as Context from "../../utils/contexts";
import CustomSearch from "../custom/CustomSearch";
import { NavBarLoggedInHead, NavBarLoggedInTail } from "./NavBarLoggedInView";
import { NavBarLoggedOutHead, NavBarLoggedOutTail } from "./NavBarLoggedOutView";

/** Props of the custom navigation component. */
interface NavBarProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}

/** UI component for a custom navigation. */
const NavBar = ({ onSignUpClicked, onLoginClicked, onLogoutSuccessful }: NavBarProps) => {
  // Retrieve the logged in user from the context
  const { loggedInUser } =
    useContext<Context.LoggedInUserContextProps | null>(Context.LoggedInUserContext) || {};
  // Retrieve the logged in user's cart from the context
  const { carts } = useContext<Context.CartsContextProps | null>(Context.CartsContext) || {};

  /** UI layout for the custom navigation. */
  return (
    <div style={{ margin: "0.5% 1%" }}>
      {/* Navigation bar head. */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          outline: "2px solid #E0E0E0",
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
          justifyContent="center"
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

          {/* Cart button. */}
          <Link to="/carts">
            <IconButton variant="plain" color="neutral" size="sm" sx={{ alignSelf: "center" }}>
              <Badge badgeContent={carts?.length} size="sm">
                <ShoppingCartIcon sx={{ fontSize: "large" }} />
              </Badge>
            </IconButton>
          </Link>

          {/* Rest of tail depending in authentication status. */}
          {loggedInUser ? (
            <NavBarLoggedInTail onLogoutSuccessful={onLogoutSuccessful} />
          ) : (
            <NavBarLoggedOutTail
              onSignUpClicked={onSignUpClicked}
              onLoginClicked={onLoginClicked}
            />
          )}
        </Stack>
      </Box>
    </div>
  );
};

export default NavBar;
