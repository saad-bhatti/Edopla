import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  Dropdown,
  IconButton,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import Button from "@mui/joy/Button";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../network/users/users_api";
import * as Context from "../../utils/contexts";
import CustomSnackbar from "../custom/CustomSnackbar";

/** UI component for the logged in view of the navigation bar head. */
export const NavBarLoggedInHead = () => {
  // State to control the display of the snackbar.
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  // State to track the text and color of the snackbar.
  type possibleColors = "primary" | "neutral" | "danger" | "success" | "warning";
  const [snackbarFormat, setSnackbarFormat] = useState<{
    text: string;
    color: possibleColors;
  }>({
    text: "",
    color: "primary",
  });

  /** UI layout for the snackbar. */
  const snackbar = (
    <CustomSnackbar
      content={snackbarFormat.text}
      color={snackbarFormat.color}
      open={snackbarVisible}
      onClose={() => {
        setSnackbarVisible(false);
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
    />
  );

  /** Function to display a snackbar for pages that are coming soon. */
  function pageComingSoon(): void {
    setSnackbarFormat({
      text: "This page is coming soon! Thank you for your patience",
      color: "primary",
    });
    setSnackbarVisible(true);
  }

  /** UI layout for the navigation bar head when logged in. */
  return (
    <div id="NavBarHead">
      {/* Snackbar. */}
      {snackbar}

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
  const { loggedInUser, setLoggedInUser } =
    useContext<Context.LoggedInUserContextProps | null>(Context.LoggedInUserContext) || {};
  // Retrieve the set cart function from the context
  const { setCarts } = useContext<Context.CartsContextProps | null>(Context.CartsContext) || {};
  // State to track whether the dropdown menu is visible.
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // State to control the display of the snackbar.
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  // State to track the text and color of the snackbar.
  type possibleColors = "primary" | "neutral" | "danger" | "success" | "warning";
  const [snackbarFormat, setSnackbarFormat] = useState<{
    text: string;
    color: possibleColors;
  }>({
    text: "",
    color: "primary",
  });

  /** UI layout for the snackbar. */
  const snackbar = (
    <CustomSnackbar
      content={snackbarFormat.text}
      color={snackbarFormat.color}
      open={snackbarVisible}
      onClose={() => {
        setSnackbarVisible(false);
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
    />
  );

  /** Function to handle logging out request. */
  async function logOut(): Promise<void> {
    try {
      // Execute the logout request
      await logout();
      setLoggedInUser!(null);
      setCarts!([]);

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      setSnackbarFormat({
        text: "Failed to log out. Please try again later.",
        color: "danger",
      });
      setSnackbarVisible(true);
    }
  }

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
        <Typography level="body-xs">{loggedInUser?.email}</Typography>
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
      {/* Snackbar. */}
      {snackbar}

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
          <IconButton
            variant="plain"
            color="neutral"
            size="lg"
            sx={{ alignSelf: "center", fontSize: "large" }}
          >
            <DensityMediumIcon />
          </IconButton>
        </MenuButton>

        {/* Dropdown menu. */}
        {isDropdownVisible && DropDownMenu}
      </Dropdown>
    </div>
  );
};
