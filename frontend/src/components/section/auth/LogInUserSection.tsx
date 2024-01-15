/**************************************************************************************************
 * This file contains the UI for the log in section of the log in page.                           *
 **************************************************************************************************/

import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import Key from "@mui/icons-material/Key";
import { Button, Divider, FormControl, FormLabel, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayError } from "../../../errors/displayError";
import { CartItem } from "../../../models/items/cartItem";
import { User } from "../../../models/users/user";
import { getCarts } from "../../../network/items/carts_api";
import { authenticateForm, authenticateGoogle } from "../../../network/users/users_api";
import { snackBarColor } from "../../../utils/contexts";
import GoogleButton from "../../GoogleButton";
import CustomInput from "../../custom/CustomInput";
import { mobileScreenInnerWidth } from "../../../styles/StylingConstants";

/** Props of the log in section. */
interface LogInSectionProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setCarts: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
}

/** UI for the log in section. */
const LogInSection = ({ setUser, setCarts, updateSnackbar }: LogInSectionProps) => {
  // Variable to navigate to other pages
  const navigate = useNavigate();

  // State to track the email input.
  const [email, setEmail] = useState<string>("");
  // State to track the password input.
  const [password, setPassword] = useState<string>("");

  /** Function to handle log in submission. */
  async function handleLogIn(identifierType: number, token: string): Promise<void> {
    try {
      let requestDetails: any;
      let user: User;
      switch (identifierType) {
        // Log in done using the log in form.
        case 0:
          requestDetails = {
            isSignUp: false,
            email: email,
            password: password,
          };
          user = await authenticateForm(requestDetails);
          break;
        // Log in done using google.
        case 1:
          requestDetails = {
            isSignUp: false,
            token: token,
          };
          user = await authenticateGoogle(requestDetails);
          break;
        // Invalid identifier type.
        default:
          throw new Error("Invalid identifier type.");
      }
      setUser!(user);

      // Retrieve the user's cart from the backend.
      user._buyer ? setCarts!(await getCarts()) : setCarts!([]);

      // Display a success message.
      updateSnackbar("Successfully logged in.", "success", true);

      // Redirect to home page.
      navigate("/");
    } catch (error) {
      // Show snackbar to indicate failure.
      error instanceof Error ? updateSnackbar(error.message, "danger", true) : displayError(error);
    }
  }

  /** UI layout for the third party login options. */
  const ThirdPartyLogIn = (
    <Stack
      direction={window.innerWidth <= mobileScreenInnerWidth ? "column" : "row"}
      gap={4}
      alignSelf="center"
    >
      {/* Google log in button. */}
      <GoogleButton
        mode={"signin_with"}
        onSuccess={(jwtToken: string) => handleLogIn(1, jwtToken)}
        onError={() => {
          updateSnackbar(
            "An error occurred while logging in with Google. Please try again.",
            "danger",
            true
          );
        }}
      />

      {/* GitHub sign up button. */}
      <Button
        variant="soft"
        color="primary"
        startDecorator={<GitHubIcon />}
        onClick={() => {
          window.location.href =
            "https://github.com/login/oauth/authorize?client_id=" +
            process.env.REACT_APP_GITHUB_CLIENT_ID;
        }}
      >
        Log in with GitHub
      </Button>
    </Stack>
  );

  /** UI layout for the card content. */
  const LogInForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleLogIn(0, "");
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
  return (
    <Stack
      id="LogInSection"
      direction="column"
      alignItems="center"
      gap={6}
      style={{ marginLeft: 0 }}
      sx={{
        minWidth: window.innerWidth <= mobileScreenInnerWidth ? "100%" : "50%",
        minHeight: window.innerWidth <= mobileScreenInnerWidth ? "82vh" : "90vh",
        px: 0,
        py: window.innerWidth <= mobileScreenInnerWidth ? "5%" : "2%",
        outline: "0.5px solid #E0E0E0",
        borderRadius: "6px",
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
};

export default LogInSection;
