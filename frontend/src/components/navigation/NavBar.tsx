import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "../../models/users/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";

/** "Type" for the props of the navigation bar dialog component. */
interface NavBarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}

/** Navigation bar dialog component. */
const NavBar = ({
  loggedInUser,
  onSignUpClicked,
  onLoginClicked,
  onLogoutSuccessful,
}: NavBarProps) => {
  const theme = "dark";

  /** UI layout for the navigation bar. */
  return (
    <Navbar bg={theme} variant="dark" expand="sm" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Edopla
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {loggedInUser ? (
            <NavBarLoggedInView
              user={loggedInUser}
              onLogoutSuccessful={onLogoutSuccessful}
              variant={theme}
            />
          ) : (
            <NavBarLoggedOutView
              onSignUpClicked={onSignUpClicked}
              onLoginClicked={onLoginClicked}
              variant={theme}
            />
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
