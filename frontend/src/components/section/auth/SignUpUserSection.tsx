/**************************************************************************************************
 * This file contains the UI for the sign up section of the sign up page.                         *
 **************************************************************************************************/

import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import Key from "@mui/icons-material/Key";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  LinearProgress,
  Stack,
  Typography
} from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayError } from "../../../errors/displayError";
import { CartItem } from "../../../models/items/cartItem";
import { User } from "../../../models/users/user";
import { authenticateForm, authenticateGoogle } from "../../../network/users/users_api";
import { InfoHelperText, mobileScreenInnerWidth } from "../../../styles/TextSX";
import { snackBarColor } from "../../../utils/contexts";
import {
  calculateDescriptivePasswordStrength,
  calculateNumericalPasswordStrength,
} from "../../../utils/passwordStrength";
import GoogleButton from "../../GoogleButton";
import CustomInput from "../../custom/CustomInput";

/** Props of the sign up section. */
interface SignUpSectionProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setCarts: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
}

/** UI for the sign up section. */
const SignUpSection = ({ setUser, setCarts, updateSnackbar }: SignUpSectionProps) => {
  // Get the navigate function.
  const navigate = useNavigate();
  // State to track the email input.
  const [email, setEmail] = useState<string>("");
  // State to track the password input.
  const [password, setPassword] = useState<string>("");
  // State to track the confirm password input.
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // State to control errors on the sign up information form.
  const [formError, setFormError] = useState<number>(0);

  /** Function to validate the sign up form. */
  function validateFormSignUp(): boolean {
    // Validate the password
    if (calculateNumericalPasswordStrength(password) < 3) {
      setFormError(2);
      updateSnackbar("The password does not meet the specified requirements", "danger", true);
      return false;
    }

    // Match the password and confirm password
    if (password !== confirmPassword) {
      setFormError(3);
      updateSnackbar("Passwords do not match", "danger", true);
      return false;
    }

    // Reset the form error state.
    setFormError(0);
    return true;
  }

  /**
   * Function to handle sign up submission.
   * @param thirdPartyToken
   *    The third party token to sign up with.
   *    Empty string if the sign up is through the form.
   * @returns Nothing.
   */
  async function handleSignUp(identifierType: number, token: string): Promise<void> {
    // Validate the form if the sign up is through the form.
    if (!identifierType) {
      const passedValidation: boolean = validateFormSignUp();
      if (!passedValidation) return;
    }

    try {
      let requestDetails: any;
      let newUser: User;
      switch (identifierType) {
        // Log in done using the log in form.
        case 0:
          requestDetails = {
            isSignUp: true,
            email: email,
            password: password,
          };
          newUser = await authenticateForm(requestDetails);
          break;
        // Log in done using google.
        case 1:
          requestDetails = {
            isSignUp: true,
            token: token,
          };
          newUser = await authenticateGoogle(requestDetails);
          break;
        // Invalid identifier type.
        default:
          throw new Error("Invalid identifier type.");
      }
      // Set the logged in user.
      setUser!(newUser);

      // Initialize the user's cart.
      setCarts!([]);

      // Set the snackbar to display a success message.
      updateSnackbar("Successfully created your account!", "success", true);

      // Navigate to the create profile page.
      navigate("/");
    } catch (error) {
      error instanceof Error ? updateSnackbar(error.message, "danger", true) : displayError(error);
    }
  }

  /** UI layout for the third party signup options. */
  const ThirdPartySignUp = (
    <Stack
      direction={window.innerWidth <= mobileScreenInnerWidth ? "column" : "row"}
      gap={4}
      alignSelf="center"
    >
      {/* Google log in button. */}
      <GoogleButton
        mode={"signup_with"}
        onSuccess={(jwtToken: string) => handleSignUp(1, jwtToken)}
        onError={() => {
          updateSnackbar(
            "An error occurred while signing up with Google. Please try again.",
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
        Sign up with GitHub
      </Button>
    </Stack>
  );

  /** UI layout for the sign up form. */
  const SignUpForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSignUp(0, "");
      }}
    >
      <Stack gap={3} direction="column" alignItems="center">
        {/* Email section. */}
        <FormControl>
          <FormLabel>Email</FormLabel>
          {/* Email input. */}
          <CustomInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            startDecorator={<EmailIcon fontSize="small" />}
            required={true}
            error={formError === 1}
          />
        </FormControl>

        {/* Password section. */}
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Stack
            spacing={0.5}
            direction="column"
            sx={{
              "--hue": Math.min(calculateNumericalPasswordStrength(password) * 40, 120),
            }}
          >
            {/* Password input. */}
            <CustomInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value);
              }}
              startDecorator={<Key fontSize="small" sx={{ alignSelf: "center" }} />}
              required={true}
              error={formError === 2}
            />
            {/* Password strength indicator. */}
            <LinearProgress
              determinate
              size="sm"
              value={Math.min((calculateNumericalPasswordStrength(password) * 100) / 3, 100)}
              sx={{
                bgcolor: "background.level3",
                color: "hsl(var(--hue) 80% 40%)",
              }}
            />
            {/* Password strength text. */}
            <Typography
              level="body-xs"
              sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
            >
              {calculateDescriptivePasswordStrength(password)}
            </Typography>
          </Stack>
        </FormControl>

        {/* Confirm password section. */}
        <FormControl>
          <Stack
            spacing={0.5}
            direction="column"
            sx={{ "--hue": Math.min(password === confirmPassword ? 120 : 0, 120) }}
          >
            {/* Confirm password input. */}
            <CustomInput
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(event.target.value);
              }}
              startDecorator={<Key fontSize="small" sx={{ alignSelf: "center" }} />}
              required={true}
              error={formError === 3}
            />

            {/* Password match text. */}
            <Typography
              level="body-xs"
              sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
            >
              {password !== confirmPassword ? "Passwords do not match" : "Passwords match"}
            </Typography>
          </Stack>
        </FormControl>

        {/* Password requirements. */}
        <InfoHelperText>
          Password requirements: Minimum of 8 characters, a number, and a special character.
        </InfoHelperText>

        {/* Sign up button. */}
        <Button type="submit" variant="solid" color="primary" sx={{ minWidth: "47%" }}>
          Sign Up
        </Button>
      </Stack>
    </form>
  );

  /** UI layout for the sign up section. */
  return (
    <Stack
      id="SignUpSection"
      direction="column"
      alignItems="center"
      gap={4}
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
      <Typography level="title-lg">Welcome to Edopla!</Typography>

      {/* Third party sign up options. */}
      {ThirdPartySignUp}

      {/* Or separator. */}
      <Divider orientation="horizontal" sx={{ padding: "0% 10%" }}>
        or
      </Divider>

      {/* Sign up form. */}
      {SignUpForm}
    </Stack>
  );
};

export default SignUpSection;
