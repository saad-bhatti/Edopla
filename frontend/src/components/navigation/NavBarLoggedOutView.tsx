import { Button, Nav } from "react-bootstrap";

/** "Type" for the props of the logged out view of the navigation bar. */
interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  variant: string;
}

/** Logged out view of the navigation bar. */
const NavBarLoggedOutView = ({
  onSignUpClicked,
  onLoginClicked,
  variant,
}: NavBarLoggedOutViewProps) => {
  /** UI layout for the navigation bar when logged out. */
  return (
    <>
      <Nav className="ms-auto">
        <Button variant={variant} onClick={onSignUpClicked}>
          Sign Up
        </Button>
        <Button variant={variant} onClick={onLoginClicked}>
          Login
        </Button>
      </Nav>
    </>
  );
};

export default NavBarLoggedOutView;
