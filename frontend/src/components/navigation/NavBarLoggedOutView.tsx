import Button from "@mui/joy/Button";

/** UI component for the logged out view of the navigation bar head. */
export const NavBarLoggedOutHead = () => {
  return <></>;
};

/** "Type" for the props of the logged out view of the navigation bar. */
interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}

/** UI component for the logged out view of the navigation bar tail. */
export const NavBarLoggedOutTail = ({
  onSignUpClicked,
  onLoginClicked,
}: NavBarLoggedOutViewProps) => {
  /** UI layout for the navigation bar when logged out. */
  return (
    <>
      {/* Sign up button. */}
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ alignSelf: "center", fontSize: "md" }}
        onClick={onSignUpClicked}
      >
        Sign Up
      </Button>

      {/* Login button. */}
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ alignSelf: "center", fontSize: "md" }}
        onClick={onLoginClicked}
      >
        Login
      </Button>
    </>
  );
};
