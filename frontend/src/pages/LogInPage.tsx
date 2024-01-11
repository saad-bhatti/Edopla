/**************************************************************************************************
 * This file contains the UI for the log in page.                                                 *
 * This page is used to log in to the website, either with an email and password or with a third  *
 * party account.                                                                                 *
 **************************************************************************************************/

import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import Key from "@mui/icons-material/Key";
import { Button, Container, Divider, FormControl, FormLabel, Stack, Typography } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import CustomInput from "../components/custom/CustomInput";
import { displayError } from "../errors/displayError";
import { User } from "../models/users/user";
import { getCarts } from "../network/items/carts_api";
import { logIn, logInGoogle } from "../network/users/users_api";
import { simpleSx } from "../styles/PageSX";
import { minPageHeight } from "../styles/constants";
import * as Context from "../utils/contexts";

/** UI for the log in page. */
const LogInPage = () => {
  // Variable to navigate to other pages
  const navigate = useNavigate();
  // Get the current color scheme and the function to change it
  const { colorScheme } = useColorScheme();

  // Retrieve the set logged in user function from the context
  const { setUser: setLoggedInUser } =
    useContext<Context.UserContextProps | null>(Context.UserContext) || {};
  // Retrieve the set cart function from the context
  const { setCarts } = useContext<Context.CartsContextProps | null>(Context.CartsContext) || {};
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(Context.SnackbarContext) || {};
  // State to track the email input.
  const [email, setEmail] = useState<string>("");
  // State to track the password input.
  const [password, setPassword] = useState<string>("");

  /** Function to handle log in submission. */
  async function handleLogIn(thirdPartyToken: string): Promise<void> {
    try {
      let user: User;
      // Log in done using the log in form.
      if (!thirdPartyToken.length) {
        const requestDetails = {
          email: email,
          password: password,
        };
        user = await logIn(requestDetails);
      }
      // Log in done using third party log in.
      else {
        const requestDetails = {
          token: thirdPartyToken,
        };
        user = await logInGoogle(requestDetails);
      }
      setLoggedInUser!(user);

      // Retrieve the user's cart from the backend.
      const carts = await getCarts();
      setCarts!(carts);

      // Display a success message.
      setSnackbar!({
        text: "Successfully logged in.",
        color: "success",
        visible: true,
      });

      // Redirect to home page.
      navigate("/");
    } catch (error) {
      // Show snackbar to indicate failure.
      if (error instanceof Error) {
        setSnackbar!({
          text: error.message,
          color: "warning",
          visible: true,
        });
      } else {
        displayError(error);
      }
    }
  }

  /** UI layout for the third party login options. */
  const ThirdPartyLogIn = (
    <Stack direction="row" gap={4} alignSelf="center" minWidth="43%">
      {/* Google log in button. */}
      <GoogleButton
        isLogIn={true}
        onSuccess={(jwtToken: string) => handleLogIn(jwtToken)}
        onError={() => {
          setSnackbar!({
            text: "An error occurred while logging in with Google. Please try again.",
            color: "danger",
            visible: true,
          });
        }}
      />

      {/* Facebook log in button. */}
      <Button
        variant="soft"
        color="primary"
        startDecorator={<FacebookIcon />}
        onClick={() => {
          setSnackbar!({
            text: "This feature is coming soon! Thank you for your patience.",
            color: "primary",
            visible: true,
          });
        }}
      >
        Continue with Facebook
      </Button>
    </Stack>
  );

  /** UI layout for the card content. */
  const LogInForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleLogIn("");
      }}
    >
      <Stack gap={4} direction="column" alignItems="center">
        {/* Email input. */}
        <FormControl>
          <FormLabel>Email</FormLabel>
          <CustomInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            startDecorator={<EmailIcon fontSize="small" />}
            required={true}
          />
        </FormControl>

        {/* Password input. */}
        <FormControl>
          <FormLabel>Password</FormLabel>
          <CustomInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            startDecorator={<Key fontSize="small" />}
            required={true}
          />
        </FormControl>

        {/* Log in button. */}
        <Button type="submit" variant="solid" color="primary" sx={{ minWidth: "100%" }}>
          Log In
        </Button>
      </Stack>
    </form>
  );

  /** UI layout for the login section. */
  const LogInSection = (
    <Stack
      direction="column"
      alignItems="center"
      gap={6}
      sx={{
        minWidth: "50vw",
        outline: "0.5px solid #E0E0E0",
        borderRadius: "6px",
        padding: "1% 0%",
        minHeight: "88vh",
      }}
    >
      {/* Welcome message. */}
      <Typography level="title-lg">Welcome back!</Typography>

      {/* Third party login options. */}
      {ThirdPartyLogIn}

      {/* Or separator. */}
      <Divider orientation="horizontal" sx={{ padding: "0% 10%" }}>
        or
      </Divider>

      {/* Log in form. */}
      {LogInForm}
    </Stack>
  );

  /** UI layout for the side image. */
  const SideImage = (
    <Container
      sx={(theme) => ({
        [theme.getColorSchemeSelector("light")]: {
          backgroundImage:
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
        },

        [theme.getColorSchemeSelector("dark")]: {
          backgroundImage:
            "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
        },
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "6px",
      })}
    />
  );

  /** Sx for the log in page. */
  const customSx: SxProps = {
    ...simpleSx,
    maxHeight: minPageHeight,
  };

  /** UI layout for the login page. */
  return (
    <Stack id="LoginPage" direction="row" spacing={1} sx={customSx}>
      {/* Log in section and side image. */}
      {colorScheme === "light" ? (
        <>
          {LogInSection} {SideImage}
        </>
      ) : (
        <>
          {SideImage} {LogInSection}
        </>
      )}
    </Stack>
  );
};

export default LogInPage;
