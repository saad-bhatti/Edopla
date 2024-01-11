/**************************************************************************************************
 * This file contains the UI for the entire application.                                          *
 * This file tracks the logged in user & their cart and provides the context.                     *
 * This file creates the navigation bar and the routes for the application.                       *
 **************************************************************************************************/

import { Library } from "@googlemaps/js-api-loader";
import Container from "@mui/joy/Container";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { SxProps, Theme } from "@mui/joy/styles/types";
import { LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { displayError } from "./errors/displayError";
import { CartItem } from "./models/items/cartItem";
import { User } from "./models/users/user";
import NavBar from "./navigation/NavBar";
import { getCarts } from "./network/items/carts_api";
import * as UsersAPI from "./network/users/users_api";
import AppRoutes from "./routes/AppRoutes";
import { onlyBackgroundSx } from "./styles/PageSX";
import { CartsContext, LoggedInUserContext } from "./utils/contexts";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Google Maps API libraries to load
const apiLibaries = ["places" as Library] as Library[];

function App() {
  // State to track the logged in user
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  // State to track the user's cart
  const [carts, setCarts] = useState<CartItem[]>([]);

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

  /** Sx for the application. */
  const customSx: SxProps = (theme: Theme) => ({
    ...onlyBackgroundSx(theme),
    minWidth: "100%",
  });

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}>
      <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
        <CartsContext.Provider value={{ carts, setCarts }}>
          <CssVarsProvider defaultMode="system">
            <CssBaseline />
            <BrowserRouter>
              <Container id="App" style={{ padding: 0, margin: 0 }} sx={customSx}>
                {/* Display for the navigation bar */}
                <NavBar />

                {/* Load the Google Maps API */}
                <LoadScript
                  googleMapsApiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY as string}
                  libraries={apiLibaries}
                >
                  {/* Available routes. */}
                  <AppRoutes />
                </LoadScript>
              </Container>
            </BrowserRouter>
          </CssVarsProvider>
        </CartsContext.Provider>
      </LoggedInUserContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
