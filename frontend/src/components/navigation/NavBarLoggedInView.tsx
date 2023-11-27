import { Button, Navbar } from "react-bootstrap";
import { User } from "../../models/users/user";
import { logout } from "../../network/users/users_api";

/** "Type" for the props of the logged in view of the navigation bar. */
interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}

/** Logged in view of the navigation bar. */
const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {
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
      <Navbar.Text className="me-2">Signed in as: {user.email}</Navbar.Text>
      <Button onClick={logOut}>Log out</Button>
    </>
  );
};

export default NavBarLoggedInView;
