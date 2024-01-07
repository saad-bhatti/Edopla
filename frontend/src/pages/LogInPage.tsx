/**************************************************************************************************
 * This file contains the UI for the log in page.                                                 *
 * This page is used to log in to the website, either with an email and password or with a third  *
 * party account.                                                                                 *
 **************************************************************************************************/

import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Key from "@mui/icons-material/Key";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Typography,
} from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/custom/CustomInput";
import CustomSnackbar from "../components/custom/CustomSnackbar";
import { displayError } from "../errors/displayError";
import { User } from "../models/users/user";
import { getCarts } from "../network/items/carts_api";
import { logIn } from "../network/users/users_api";
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
  const { setLoggedInUser } =
    useContext<Context.LoggedInUserContextProps | null>(Context.LoggedInUserContext) || {};
  // Retrieve the set cart function from the context
  const { setCarts } = useContext<Context.CartsContextProps | null>(Context.CartsContext) || {};
  // State to track the email input.
  const [email, setEmail] = useState<string>("");
  // State to track the password input.
  const [password, setPassword] = useState<string>("");

  // State to control errors on the buyer information form.
  const [formError, setFormError] = useState<{ isError: boolean; error: string }>({
    isError: false,
    error: "",
  });

  // State to control the display of the snackbar.
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  // State to track the text and color of the snackbar.
  type possibleColors = "primary" | "neutral" | "danger" | "success" | "warning";
  const [snackbarFormat, setSnackbarFormat] = useState<{
    text: string;
    color: possibleColors;
  }>({
    text: "",
    color: "primary",
  });

  /** UI layout for the third party login options. */
  const thirdPartyLogIn = (
    <Stack direction="column" gap={4} alignSelf="center" minWidth="43%">
      {/* Google log in button. */}
      <Button
        variant="soft"
        color="primary"
        startDecorator={<GoogleIcon />}
        onClick={() => {
          setSnackbarFormat({
            text: "This feature is coming soon! Thank you for your patience.",
            color: "primary",
          });
          setSnackbarVisible(true);
        }}
      >
        Continue with Google
      </Button>

      {/* Facebook log in button. */}
      <Button
        variant="soft"
        color="primary"
        startDecorator={<FacebookIcon />}
        onClick={() => {
          setSnackbarFormat({
            text: "This feature is coming soon! Thank you for your patience.",
            color: "primary",
          });
          setSnackbarVisible(true);
        }}
      >
        Continue with Facebook
      </Button>
    </Stack>
  );

  /** Function to handle log in submission. */
  async function handleLogIn() {
    // Reset the form error state.
    setFormError({ isError: false, error: "" });

    try {
      // Retrieve the user's information from the backend.
      const requestDetails = {
        email: email,
        password: password,
      };
      const user: User = await logIn(requestDetails);
      setLoggedInUser!(user);

      // Retrieve the user's cart from the backend.
      const carts = await getCarts();
      setCarts!(carts);

      // Redirect to home page.
      navigate("/");
    } catch (error) {
      // Show snackbar to indicate failure.
      if (error instanceof Error) {
        setSnackbarFormat({
          text: error.message.split(":")[2],
          color: "danger",
        });
        setSnackbarVisible(true);
      } else {
        displayError(error);
      }
    }
  }

  /** UI layout for the card content. */
  const logInForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleLogIn();
      }}
    >
      <Stack gap={4} direction="column" alignItems="center">
        {/* Form error text. */}
        {formError.isError && (
          <FormControl error>
            <FormHelperText>
              <InfoOutlined fontSize="small" />
              {formError.error}
            </FormHelperText>
          </FormControl>
        )}

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
  const logInSection = (
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
      {thirdPartyLogIn}

      {/* Or separator. */}
      <Divider orientation="horizontal" sx={{ padding: "0% 10%" }}>
        or
      </Divider>

      {/* Log in form. */}
      {logInForm}
    </Stack>
  );

  /** UI layout for the side image. */
  const sideImage = (
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

  /** UI layout for the snackbar. */
  const snackbar = (
    <CustomSnackbar
      content={snackbarFormat.text}
      color={snackbarFormat.color}
      open={snackbarVisible}
      onClose={() => {
        setSnackbarVisible(false);
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
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
      {/* Snackbar. */}
      {snackbar}

      {/* Log in section and side image. */}
      {colorScheme === "light" ? (
        <>
          {logInSection} {sideImage}
        </>
      ) : (
        <>
          {sideImage} {logInSection}
        </>
      )}
    </Stack>
  );
};

export default LogInPage;
