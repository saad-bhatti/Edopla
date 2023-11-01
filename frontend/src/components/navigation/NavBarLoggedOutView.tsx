import { Button } from "react-bootstrap";

// "Type" for the props of the logged out view of the navigation bar
interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}

// Logged out view of the navigation bar
const NavBarLoggedOutView = ({ onSignUpClicked, onLoginClicked }: NavBarLoggedOutViewProps) => {
  return (
    <>
      <Button onClick={onSignUpClicked}>Sign Up</Button>
      <Button onClick={onLoginClicked}>Login</Button>
    </>
  );
};

export default NavBarLoggedOutView;
