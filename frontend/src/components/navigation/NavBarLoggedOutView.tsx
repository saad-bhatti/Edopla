import Button from "@mui/joy/Button";
import { Link } from "react-router-dom";

/** UI component for the logged out view of the navigation bar head. */
export const NavBarLoggedOutHead = () => {
  return <div id="NavBarHead"></div>;
};

/** UI component for the logged out view of the navigation bar tail. */
export const NavBarLoggedOutTail = () => {
  /** UI layout for the navigation bar when logged out. */
  return (
    <div id="NavBarTail">
      {/* Sign up button. */}
      <Link to="/signup">
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ alignSelf: "center", fontSize: "md" }}
        >
          Sign Up
        </Button>
      </Link>

      {/* Login button. */}
      <Link to="/login">
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ alignSelf: "center", fontSize: "md" }}
        >
          Login
        </Button>
      </Link>
    </div>
  );
};
