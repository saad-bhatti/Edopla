import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
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
import { Link } from "react-router-dom";
import { displayError } from "../../errors/displayError";
import { logout } from "../../network/users/users_api";
import { LoggedInUserContext, LoggedInUserContextProps } from "../../utils/contexts";

/** UI component for the logged in view of the navigation bar head. */
export const NavBarLoggedInHead = () => {
  /** UI layout for the navigation bar head when logged in. */
  return (
    <>
      {/* Buy button. */}
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ alignSelf: "center", fontSize: "md" }}
      >
        Buy
      </Button>

      {/* Sell button. */}
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ alignSelf: "center", fontSize: "md" }}
      >
        Sell
      </Button>

      {/* Orders button. */}
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ alignSelf: "center", fontSize: "md" }}
      >
        Orders
      </Button>
    </>
  );
};

/** "Type" for the props of the logged in view of the navigation bar. */
interface NavBarLoggedInViewProps {
  onLogoutSuccessful: () => void;
}

/** UI component for the logged in view of the navigation bar tail. */
export const NavBarLoggedInTail = ({ onLogoutSuccessful }: NavBarLoggedInViewProps) => {
  // Retrieve the logged in user from the context
  const { loggedInUser } = useContext<LoggedInUserContextProps | null>(LoggedInUserContext) || {};
  // State to track whether the dropdown menu is visible.
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  /** Function to handle logging out request. */
  async function logOut() {
    try {
      await logout();
      onLogoutSuccessful();
    } catch (error) {
      alert(error);
      displayError(error);
    }
  }

  /** UI layout for the dropdown menu. */
  const DropDownMenu = (
    <Menu
      placement="bottom-end"
      size="sm"
      sx={{
        p: 1,
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
      <Link to="/">
        <MenuItem onClick={logOut}>
          <LogoutRoundedIcon />
          Log out
        </MenuItem>
      </Link>
    </Menu>
  );

  /** UI layout for the navigation bar tail when logged in. */
  return (
    <>
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
    </>
  );
};
