import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BuyerProfileModal from "./components/modal/BuyerProfileModal";
import LoginModal from "./components/modal/LoginModal";
import SignUpModal from "./components/modal/SignUpModal";
import VendorProfileModal from "./components/modal/VendorProfileModal";
import NavBar from "./components/navigation/NavBar";
import { displayError } from "./errors/displayError";
import { CartItem } from "./models/items/cartItem";
import { User } from "./models/users/user";
import { getCarts } from "./network/items/carts_api";
import * as UsersAPI from "./network/users/users_api";
import CartPage from "./pages/Cart/CartPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/Menu/MenuPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilesPage from "./pages/ProfilesPage";
import styles from "./styles/App.module.css";
import { CartsContext, LoggedInUserContext } from "./utils/contexts";

function App() {
  // State to track the logged in user
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  // State to track the user's cart
  const [carts, setCarts] = useState<CartItem[]>([]);
  // State to control whether the sign up modal is shown
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  // State to control whether the login modal is shown
  const [showLoginModal, setShowLogInModal] = useState(false);
  // State to control whether the buyer modal is shown
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  // State to control whether the vendor modal is shown
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Retrieve the logged in user and their cart only once before rendering the page
  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UsersAPI.getLoggedInUser();
        setLoggedInUser(user);
        setCarts(await getCarts());
      } catch (error) {
        displayError(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <CartsContext.Provider value={{ carts, setCarts }}>
        <BrowserRouter>
          <div>
            {/* Display for the navigation bar */}
            <NavBar
              onSignUpClicked={() => {
                setShowSignUpModal(true);
              }}
              onLoginClicked={() => {
                setShowLogInModal(true);
              }}
              onLogoutSuccessful={() => {
                setLoggedInUser(null);
                setCarts([]);
              }}
            />

            {/* Available routes. */}
            <Container className={styles.pageContainer}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profiles" element={<ProfilesPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/menu/:vendorId" element={<MenuPage />} />
                <Route path="/*" element={<NotFoundPage />} />
              </Routes>
            </Container>

            {/* Sign up modal */}
            {showSignUpModal && (
              <SignUpModal
                onDismissed={() => {
                  setShowSignUpModal(false);
                }}
                onSignUpSuccessful={(user) => {
                  setLoggedInUser(user);
                  setShowSignUpModal(false);
                  setShowBuyerModal(true);
                }}
              />
            )}

            {/* Buyer profile creation modal */}
            {showBuyerModal && (
              <BuyerProfileModal
                buyer={null}
                onSaveSuccessful={(buyer) => {
                  setShowBuyerModal(false);
                  setShowVendorModal(true);
                }}
                onDismissed={() => {}}
              />
            )}

            {/* Vendor profile creation modal */}
            {showVendorModal && (
              <VendorProfileModal
                vendor={null}
                onSaveSuccessful={(vendor) => {
                  setShowVendorModal(false);
                }}
                onDismissed={() => {}}
              />
            )}

            {/* Login modal */}
            {showLoginModal && (
              <LoginModal
                onDismissed={() => {
                  setShowLogInModal(false);
                }}
                onLoginSuccessful={async (user) => {
                  setLoggedInUser(user);
                  setCarts(await getCarts());
                  setShowLogInModal(false);
                }}
              />
            )}
          </div>
        </BrowserRouter>
      </CartsContext.Provider>
    </LoggedInUserContext.Provider>
  );
}

export default App;
