import { Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "../../models/users/user";
import { logout } from "../../network/users/users_api";

/** "Type" for the props of the logged in view of the navigation bar. */
interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
  variant: string;
}

/** Logged in view of the navigation bar. */
const NavBarLoggedInView = ({ user, onLogoutSuccessful, variant }: NavBarLoggedInViewProps) => {
  /** Function to handle logging out request. */
  async function logOut() {
    try {
      await logout();
      onLogoutSuccessful();
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  /** UI layout for the navigation bar when logged in. */
  return (
    <>
      <Nav className="me-auto">
        <Nav.Link>Buy</Nav.Link>
        <Nav.Link>Sell</Nav.Link>
      </Nav>

      <Nav className="ms-auto">
        <NavDropdown title="Account" id="collapsible-nav-dropdown">
          <NavDropdown.Item as={Link} to="/profiles">Profiles</NavDropdown.Item>
          <NavDropdown.Item>Orders</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </>
  );
};

export default NavBarLoggedInView;
