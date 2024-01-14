/**************************************************************************************************
 * This file contains the UI for the navigation bar when the user is logged in.                   *
 **************************************************************************************************/

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Dropdown,
  IconButton,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/joy";
import Badge from "@mui/joy/Badge";
import Button from "@mui/joy/Button";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../network/users/users_api";
import * as Context from "../utils/contexts";
import { googleLogout } from "@react-oauth/google";

/** UI component for the logged in view of the navigation bar head. */
export const NavBarLoggedInHead = () => {
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(Context.SnackbarContext) || {};

  /** Function to display a snackbar for pages that are coming soon. */
  function pageComingSoon(): void {
    setSnackbar!({
      text: "This page is coming soon! Thank you for your patience",
      color: "primary",
      visible: true,
    });
  }

  /** UI layout for the navigation bar head when logged in. */
  return (
    <div id="NavBarHead">
      {/* Buy button. */}
      <Link to="/buy">
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ alignSelf: "center", fontSize: "md" }}
        >
          Buy
        </Button>
      </Link>

      {/* Sell button. */}
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        onClick={pageComingSoon}
        sx={{ alignSelf: "center", fontSize: "md" }}
      >
        Sell
      </Button>

      {/* Orders button. */}
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        onClick={pageComingSoon}
        sx={{ alignSelf: "center", fontSize: "md" }}
      >
        Orders
      </Button>
    </div>
  );
};

/** UI component for the logged in view of the navigation bar tail. */
export const NavBarLoggedInTail = () => {
  // Variable to navigate to other pages
  const navigate = useNavigate();
  // Retrieve the logged in user from the context
  const { user, setUser } = useContext<Context.UserContextProps | null>(Context.UserContext) || {};
  // Retrieve the identification from the user context
  const identification =
    user?.identification.email || user?.identification.googleId || user?.identification.gitHubId;
  // Retrieve the set cart function from the context
  const { carts, setCarts } =
    useContext<Context.CartsContextProps | null>(Context.CartsContext) || {};
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(Context.SnackbarContext) || {};
  // State to track whether the dropdown menu is visible.
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  /** Function to handle logging out request. */
  async function logOut(): Promise<void> {
    try {
      // Log out from Google
      if (user?.identification.googleId) googleLogout();

      // Execute the logout request
      await logout();
      setUser!(null);
      setCarts!([]);

      // Display a success message
      setSnackbar!({
        text: "Successfully logged out.",
        color: "success",
        visible: true,
      });

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      setSnackbar!({
        text: "Failed to log out. Please try again later.",
        color: "danger",
        visible: true,
      });
    }
  }

  /** UI layout for the cart button. */
  const CartButton = (
    <Link to="/carts">
      <IconButton variant="plain" color="neutral" size="sm" sx={{ alignSelf: "center" }}>
        <Badge badgeContent={carts?.length} size="sm">
          <ShoppingCartIcon sx={{ fontSize: "large" }} />
        </Badge>
      </IconButton>
    </Link>
  );

  /** UI layout for the dropdown menu. */
  const DropDownMenu = (
    <Menu
      placement="bottom-end"
      size="sm"
      sx={{
        padding: 1,
        gap: 1,
      }}
    >
      {/* User email. */}
      <MenuItem>
        <Typography level="body-xs">{identification}</Typography>
      </MenuItem>

      <ListDivider />

      {/* Profile button. */}
      <Link to="/profiles">
        <MenuItem>
          <AccountCircleIcon />
          Profiles
        </MenuItem>
      </Link>

      <ListDivider />

      {/* Log out button. */}
      <MenuItem onClick={logOut}>
        <LogoutRoundedIcon />
        Log out
      </MenuItem>
    </Menu>
  );

  /** UI layout for the navigation bar tail when logged in. */
  return (
    <div id="NavBarTail">
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        {/* Cart button. */}
        {CartButton}

        {/* Dropdown menu. */}
        <Dropdown>
          {/* Profile button. */}
          <MenuButton
            variant="plain"
            size="sm"
            sx={{ maxWidth: "32px", maxHeight: "32px", borderRadius: "9999999px" }}
            onClick={() => {
              setIsDropdownVisible(true);
            }}
          >
            <DensityMediumIcon />
          </MenuButton>

          {/* Dropdown menu. */}
          {isDropdownVisible && DropDownMenu}
        </Dropdown>
      </Stack>
    </div>
  );
};
