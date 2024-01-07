/**************************************************************************************************
 * This file contains the UI for the sign up section of the sign up page.                         *
 **************************************************************************************************/

import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Key from "@mui/icons-material/Key";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import CustomInput from "../../components/custom/CustomInput";
import { displayError } from "../../errors/displayError";
import { ConflictError } from "../../errors/http_errors";
import { CartItem } from "../../models/items/cartItem";
import { User } from "../../models/users/user";
import { signUp } from "../../network/users/users_api";
import {
  calculateDescriptivePasswordStrength,
  calculateNumericalPasswordStrength,
} from "../../utils/passwordStrength";

/** Props of the sign up section. */
interface SignUpSectionProps {
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>;
  setCarts: React.Dispatch<React.SetStateAction<CartItem[]>>;

  setStep: React.Dispatch<React.SetStateAction<number>>;

  setSnackbarFormat: React.Dispatch<
    React.SetStateAction<{
      text: string;
      color: "primary" | "neutral" | "danger" | "success" | "warning";
    }>
  >;
  setSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

/** UI for the sign up section. */
const SignUpSection = ({
  setLoggedInUser,
  setCarts,
  setStep,
  setSnackbarFormat,
  setSnackbarVisible,
}: SignUpSectionProps) => {
  // State to track the email input.
  const [email, setEmail] = useState<string>("");
  // State to track the password input.
  const [password, setPassword] = useState<string>("");
  // State to track the confirm password input.
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // State to control errors on the sign up information form.
  const [formError, setFormError] = useState<{ isError: number; error: string }>({
    isError: 0,
    error: "",
  });

  /** UI layout for the third party signup options. */
  const thirdPartySignUp = (
    <Stack direction="column" gap={4} alignSelf="center" minWidth="43%">
      {/* Google sign up button. */}
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
        Sign up with Google
      </Button>

      {/* Facebook sign up button. */}
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
        Sign up with Facebook
      </Button>
    </Stack>
  );

  /** Function to handle sign up submission. */
  async function handleSignUp() {
    // Validate the password
    if (calculateNumericalPasswordStrength(password) < 3) {
      setFormError({
        isError: 2,
        error: "The password does not meet the specified requirements",
      });
      return;
    }

    // Match the password and confirm password
    if (password !== confirmPassword) {
      setFormError({ isError: 3, error: "Passwords do not match" });
      return;
    }

    // Reset the form error state.
    setFormError({ isError: 0, error: "" });

    try {
      // Send request to backend to create the new user.
      const requestDetails = {
        email: email,
        password: password,
      };
      const newUser: User = await signUp(requestDetails);
      setLoggedInUser!(newUser);

      // Initialize the user's cart.
      setCarts!([]);

      // Set the snackbar to display a success message.
      setSnackbarFormat({
        text: "Successfully created your account!",
        color: "success",
      });
      setSnackbarVisible(true);

      // Increment the step.
      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      if (error instanceof ConflictError)
        setFormError({
          isError: 1,
          error: error.message,
        });
      else if (error instanceof Error) {
        setSnackbarFormat({
          text: error.message,
          color: "danger",
        });
        setSnackbarVisible(true);
      } else displayError(error);
    }
  }

  /** UI layout for the sign up form. */
  const signUpForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSignUp();
      }}
    >
      <Stack gap={3} direction="column" alignItems="center">
        {/* Form error text. */}
        {formError.isError !== 0 && (
          <FormControl error>
            <FormHelperText>
              <InfoOutlined fontSize="small" />
              {formError.error}
            </FormHelperText>
          </FormControl>
        )}

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
            error={formError.isError === 1}
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
              error={formError.isError === 2}
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
              error={formError.isError === 3}
            />

            {/* Password match text. */}
            {confirmPassword.length > 0 && (
              <Typography
                level="body-xs"
                sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
              >
                {password !== confirmPassword ? "Passwords do not match" : "Passwords match"}
              </Typography>
            )}
          </Stack>
        </FormControl>

        {/* Password requirements. */}
        <FormHelperText sx={{ fontSize: "small" }}>
          <InfoOutlined fontSize="small" />
          Password requirements: Minimum of 8 characters, a number, and a special character.
        </FormHelperText>

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
      gap={3}
      sx={{
        minWidth: "50vw",
        outline: "0.5px solid #E0E0E0",
        borderRadius: "6px",
        padding: "1% 0%",
        minHeight: "75vh",
      }}
    >
      {/* Welcome message. */}
      <Typography level="title-lg">Welcome to Edopla!</Typography>

      {/* Third party sign up options. */}
      {thirdPartySignUp}

      {/* Or separator. */}
      <Divider orientation="horizontal" sx={{ padding: "0% 10%" }}>
        or
      </Divider>

      {/* Sign up form. */}
      {signUpForm}
    </Stack>
  );
};

export default SignUpSection;
