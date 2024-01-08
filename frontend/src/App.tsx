/**************************************************************************************************
 * This file contains the UI for the entire application.                                          *
 * This file tracks the logged in user & their cart and provides the context.                     *
 * This file creates the navigation bar and the routes for the application.                       *
 **************************************************************************************************/

import Container from "@mui/joy/Container";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./navigation/NavBar";
import { displayError } from "./errors/displayError";
import { CartItem } from "./models/items/cartItem";
import { User } from "./models/users/user";
import { getCarts } from "./network/items/carts_api";
import * as UsersAPI from "./network/users/users_api";
import { CartsContext, LoggedInUserContext } from "./utils/contexts";
import { onlyBackgroundSx } from "./styles/PageSX";
import { SxProps, Theme } from "@mui/joy/styles/types";

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
    <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <CartsContext.Provider value={{ carts, setCarts }}>
        <CssVarsProvider defaultMode="system">
          <CssBaseline />
          <BrowserRouter>
            <Container id="App" style={{ padding: 0, margin: 0 }} sx={customSx}>
              {/* Display for the navigation bar */}
              <NavBar />

              {/* Available routes. */}
              <AppRoutes />
            </Container>
          </BrowserRouter>
        </CssVarsProvider>
      </CartsContext.Provider>
    </LoggedInUserContext.Provider>
  );
}

export default App;
