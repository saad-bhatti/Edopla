/**************************************************************************************************
 * This file contains the UI for the entire application.                                          *
 * This file tracks the logged in user & their cart and provides the context.                     *
 * This file creates the navigation bar and the routes for the application.                       *
 **************************************************************************************************/

import { Library } from "@googlemaps/js-api-loader";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { LinearProgress } from "@mui/joy";
import Container from "@mui/joy/Container";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { SxProps, Theme } from "@mui/joy/styles/types";
import { LoadScript } from "@react-google-maps/api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import CustomSnackbar from "./components/custom/CustomSnackbar";
import { CartItem } from "./models/items/cartItem";
import { User } from "./models/users/user";
import NavBar from "./navigation/NavBar";
import { getCarts } from "./network/items/carts_api";
import * as UsersAPI from "./network/users/users_api";
import AppRoutes from "./routes/AppRoutes";
import { onlyBackgroundSx } from "./styles/PageSX";
import * as Context from "./utils/contexts";
import { mobileScreenInnerWidth } from "./styles/TextSX";

// Google Maps API libraries to load
const apiLibaries = ["places" as Library] as Library[];

function App() {
  // State to track the logged in user
  const [user, setUser] = useState<User | null>(null);
  // State to track the user's cart
  const [carts, setCarts] = useState<CartItem[]>([]);
  // State to track the snackbar
  const [snackbar, setSnackbar] = useState<{
    text: string;
    color: Context.snackBarColor;
    visible: boolean;
  }>({
    text: "",
    color: "primary",
    visible: false,
  });
  // State to track if the view is considered mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < mobileScreenInnerWidth);
  // State to track whether the page data is being loaded.
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve the logged in user and their cart only once before rendering the page
  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        setIsLoading(true);

        const user = await UsersAPI.getLoggedInUser();
        setUser(user);
        setCarts(await getCarts());

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false); // Stop loading as this error is expected when not authenticated
      }
    }
    fetchLoggedInUser();

    // Add event listener to track if the view is considered mobile
    function handleResize() {
      setIsMobile(window.innerWidth <= mobileScreenInnerWidth);
    }
    window.addEventListener('resize', handleResize);
  }, [isMobile]);

  /** Sx for the application. */
  const customSx: SxProps = (theme: Theme) => ({
    ...onlyBackgroundSx(theme),
    minWidth: "100%",
    minHeight: "100vh",
  });

  /** UI layout for the snackbar. */
  const Snackbar = (
    <CustomSnackbar
      content={snackbar.text}
      color={snackbar.color}
      open={snackbar.visible}
      onClose={() => {
        setSnackbar({ ...snackbar, visible: false });
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
    />
  );

  return isLoading ? (
    <LinearProgress size="lg" value={28} variant="soft" />
  ) : (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}>
      {/* Application contexts. */}
      <Context.UserContext.Provider value={{ user, setUser }}>
        <Context.CartsContext.Provider value={{ carts, setCarts }}>
          <Context.SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
            {/* Application layout. */}
            <CssVarsProvider defaultMode="system">
              <CssBaseline />

              {/* Application content. */}
              <BrowserRouter>
                <Container id="App" style={{ padding: 0, margin: 0 }} sx={customSx}>
                  {/* Navigation bar. */}
                  <NavBar />

                  {/* Google places API. */}
                  <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY as string}
                    libraries={apiLibaries}
                  >
                    {/* Available routes. */}
                    <AppRoutes />
                  </LoadScript>

                  {/* Snackbar. */}
                  {Snackbar}
                </Container>
              </BrowserRouter>
            </CssVarsProvider>
          </Context.SnackbarContext.Provider>
        </Context.CartsContext.Provider>
      </Context.UserContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
