import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import SignUpModal from "./components/SignUpModal";
import NavBar from "./components/navigation/NavBar";
import { User } from "./models/user";
import * as UsersAPI from "./network/users_api";
import NotFoundPage from "./pages/NotFoundPage";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import styles from "./styles/App.module.css";

function App() {
  // State to track the logged in user
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  // State to control whether the sign up dialog is shown
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  // State to control whether the login dialog is shown
  const [showLoginModal, setShowLogInModal] = useState(false);

  // Retrieve the logged in user only once before rendering the page
  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UsersAPI.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        {/* Display for the navigation bar */}
        <NavBar
          loggedInUser={loggedInUser}
          onSignUpClicked={() => {
            setShowSignUpModal(true);
          }}
          onLoginClicked={() => {
            setShowLogInModal(true);
          }}
          onLogoutSuccessful={() => {
            setLoggedInUser(null);
          }}
        />

        <Container className={styles.pageContainer}>
          <Routes>
            <Route path="/" element={<NotesPage loggedInUser={loggedInUser} />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Container>

        {/* Sign up dialog */}
        {showSignUpModal && (
          <SignUpModal
            onDismissed={() => {
              setShowSignUpModal(false);
            }}
            onSignUpSuccessful={(user) => {
              setLoggedInUser(user);
              setShowSignUpModal(false);
            }}
          />
        )}

        {/* Login dialog */}
        {showLoginModal && (
          <LoginModal
            onDismissed={() => {
              setShowLogInModal(false);
            }}
            onLoginSuccessful={(user) => {
              setLoggedInUser(user);
              setShowLogInModal(false);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
